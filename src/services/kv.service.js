import axios from 'axios';
import { setValue, getValue, deleteValue } from '../store/memory.store.js';
import { getReplicaNodes } from './cluster.service.js';
import { WRITE_QUORUM, READ_QUORUM } from '../config/config.js';
import { SELF_URL, NODE_ID } from '../config/config.js';
import { incrementClock, compareClocks } from '../utils/vectorClock.util.js';
import { addHint } from '../store/hints.store.js';

const retryRequest = async (fn, retries = 2) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
    }
  }
};

const isSameNode = (node) => {
  return new URL(node).hostname === new URL(SELF_URL).hostname;
};

//
// 🔹 LOCAL OPERATIONS
//
export const getKeyLocal = (key) => {
  return getValue(key);
};

export const setKeyLocal = (key, value, incomingClock = {}) => {
  const existing = getValue(key);

  // 🔥 merge clocks
  const mergedClock = {
    ...(existing?.vectorClock || {}),
    ...incomingClock
  };

  const newClock = incrementClock(mergedClock, NODE_ID);

  // conflict resolution
  if (existing?.vectorClock) {
    const cmp = compareClocks(existing.vectorClock, incomingClock);

    if (cmp === 1) {
      return; // existing is newer
    }
  }

  setValue(key, value, newClock);
};

export const deleteKeyLocal = (key) => {
  deleteValue(key);
};

//
// 🔹 WRITE (QUORUM + HINTED HANDOFF)
//
export const setKey = async (key, value) => {
  const replicas = getReplicaNodes(key);

  const baseClock = incrementClock({}, NODE_ID);

  const results = await Promise.allSettled(
    replicas.map(async (node) => {
      try {
        if (isSameNode(node)) {
          setKeyLocal(key, value, baseClock);
        } else {
          await retryRequest(() =>
            axios.post(`${node}/kv/internal`, {
              key,
              value,
              vectorClock: baseClock
            }, { timeout: 1500 })
          );
        }
        return true;
      } catch (err) {
        console.error(`Node down: ${node} → storing hint`);

        addHint(node, { key, value, vectorClock: baseClock });

        throw err;
      }
    })
  );

  const successCount = results.filter(r => r.status === 'fulfilled').length;

  console.log("Replicas:", replicas);
  console.log("SuccessCount:", successCount);

  if (successCount < WRITE_QUORUM) {
    throw new Error("Write quorum not satisfied");
  }
};

//
// 🔹 READ (QUORUM + READ REPAIR)
//
export const getKey = async (key) => {
  const replicas = getReplicaNodes(key);

  const results = await Promise.allSettled(
    replicas.map(async (node) => {
      if (isSameNode(node)) {
        return getValue(key);
      } else {
        const res = await retryRequest(() =>
          axios.get(`${node}/kv/internal/${key}`, { timeout: 1500 })
        );
        return res.data;
      }
    })
  );

  const values = results
    .filter(r => r.status === 'fulfilled' && r.value)
    .map(r => r.value);

  if (values.length < READ_QUORUM) {
    throw new Error("Read quorum not satisfied");
  }

  // find latest
  let latest = values[0];

  for (let val of values) {
    const cmp = compareClocks(val.vectorClock, latest.vectorClock);
    if (cmp === 1) {
      latest = val;
    }
  }

  // 🔥 READ REPAIR (FIXED PAYLOAD)
  await Promise.allSettled(
    replicas.map(async (node) => {
      try {
        await axios.post(`${node}/kv/internal`, {
          key,
          value: latest.value,
          vectorClock: latest.vectorClock
        }, { timeout: 1000 });
      } catch {}
    })
  );

  return latest.value;
};

//
// 🔹 DELETE
//
export const deleteKey = async (key) => {
  const replicas = getReplicaNodes(key);

  const results = await Promise.allSettled(
    replicas.map(async (node) => {
      if (isSameNode(node)) {
        deleteKeyLocal(key);
        return true;
      } else {
        await retryRequest(() =>
          axios.delete(`${node}/kv/internal/${key}`, {
            timeout: 1500
          })
        );
        return true;
      }
    })
  );

  const successCount = results.filter(r => r.status === 'fulfilled').length;

  if (successCount < WRITE_QUORUM) {
    throw new Error("Delete quorum not satisfied");
  }
};