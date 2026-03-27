import { SELF_URL, NODES } from '../config/config.js';
import { hash } from '../utils/hash.util.js';
import { REPLICATION_FACTOR } from '../config/config.js';
import { getAliveNodes } from '../store/cluster.store.js';

let cachedRing = null;

const getRing = () => {
    const nodes = getAliveNodes();
    if (cachedRing) return cachedRing;

    const allNodes = [...new Set([...NODES, SELF_URL])];

    if (!allNodes.length) {
        throw new Error("No nodes available in cluster");
    }

    cachedRing = allNodes
        .map(node => ({
            node,
            hash: hash(node)
        }))
        .sort((a, b) => a.hash - b.hash);

    return cachedRing;
};

export const getResponsibleNode = (key) => {
    const ring = getRing();
    const keyHash = hash(key);

    console.log(`Key: ${key}, Hash: ${keyHash}`);

    for (let node of ring) {
        if (keyHash <= node.hash) {
            console.log(`Assigned to: ${node.node}`);
            return node.node;
        }
    }

    console.log(`Assigned to (wrap): ${ring[0].node}`);
    return ring[0].node;
};

export const isCurrentNodeResponsible = (key) => {
    return getResponsibleNode(key) === SELF_URL;
};

export const getOtherNodes = () => {
    return NODES.filter(node => node !== SELF_URL);
};

export const getReplicaNodes = (key) => {
    const ring = getRing();
    const keyHash = hash(key);

    let startIndex = ring.findIndex(node => keyHash <= node.hash);

    if (startIndex === -1) startIndex = 0;

    const replicas = [];

    for (let i = 0; i < REPLICATION_FACTOR; i++) {
        const index = (startIndex + i) % ring.length;
        replicas.push(ring[index].node);
    }

    return replicas;
};