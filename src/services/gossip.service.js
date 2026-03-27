import axios from 'axios';
import { updateNode, getAllNodes } from '../store/cluster.store.js';
import { SELF_URL } from '../config/config.js';

export const startGossip = () => {
  setInterval(async () => {
    const nodes = getAllNodes();

    for (let node of nodes) {
      if (node === SELF_URL) continue;

      try {
        const res = await axios.get(`${node}/gossip`, { timeout: 1000 });

        // merge cluster info
        for (let peer of res.data.nodes) {
          updateNode(peer, 'alive');
        }

        updateNode(node, 'alive');
      } catch {
        updateNode(node, 'dead');
      }
    }
  }, 3000);
};