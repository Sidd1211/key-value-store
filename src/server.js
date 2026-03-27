import app from './app.js';
import { PORT, NODE_ID, NODES, SELF_URL } from './config/config.js';
import axios from 'axios';
import { getHints, clearHints } from './store/hints.store.js';
import { replayLog } from './store/wal.store.js';
import { setValue, deleteValue } from './store/memory.store.js';
import { startGossip } from './services/gossip.service.js';
import { updateNode } from './store/cluster.store.js';

updateNode(SELF_URL);

NODES.forEach(node => updateNode(node));

startGossip();
setInterval(async () => {
  for (let node of NODES) {
    const hints = getHints(node);

    if (!hints.length) continue;

    try {
      await axios.get(`${node}/health`);

      for (let hint of hints) {
        await axios.post(`${node}/kv/internal`, hint);
      }

      clearHints(node);
      console.log(`Replayed hints for ${node}`);
    } catch {
      // still down
    }
  }
}, 5000);

const logs = replayLog();

for (let entry of logs) {
  if (entry.type === 'SET') {
    setValue(entry.key, entry.value, entry.vectorClock);
  } else if (entry.type === 'DELETE') {
    deleteValue(entry.key);
  }
}

console.log("WAL recovery complete");
app.listen(PORT, () => {
  console.log(`Node ${NODE_ID} running on port ${PORT}`);
});