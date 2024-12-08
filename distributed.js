const axios = require('axios');

const config = {
  // using static node replications to replicate else we can implement this by Distributed Functionality through Zookeeper
  nodes: [
    { address: 'http://localhost:3006' },
    { address: 'http://localhost:3007' },
    // ... more nodes
  ]
};

async function replicateData(key, value, operation = 'set') {
  const replicationPromises = config.nodes.map(async (node) => {
    try {
      const url = `${node.address}/api/kv`;
      const data = { key, value, operation };

      const response = await axios.post(url, data);
      console.log(`Data replicated to ${node.address} successfully:`, response.data);
    } catch (error) {
      console.error(`Error replicating data to ${node.address}: ${error.message}`);
      if (error.response) {
        console.error(`Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`);
      }
    }
  });

  // Wait for all replication requests to complete without rejecting on failure
  await Promise.allSettled(replicationPromises);

  console.log('Replication process completed.');
}

module.exports = {
  replicateData,
};

// const ZooKeeper = require('node-zookeeper-client');
// const axios = require('axios');

// async function discoverNodes() {
//   const zkClient = ZooKeeper.createClient('localhost:2181');
//   await zkClient.connect();

//   const children = await zkClient.getChildrenAsync('/services/key-value-store');
//   const nodes = children.map(child => {
//     const nodeData = zkClient.getDataAsync(`/services/key-value-store/${child}`);
//     return nodeData.then(data => ({
//       address: data.toString()
//     }));
//   });

//   return Promise.all(nodes);
// }

// async function replicateData(key, value, operation = 'set') {
//   const nodes = await discoverNodes();
//   nodes.forEach(node => {
//     const url = `${node.address}/api/kv`;
//     const data = { key, value, operation };

//     axios.post(url, data)
//       .then(response => {
//         console.log(`Data replicated to ${node.address} successfully`);
//       })
//       .catch(error => {
//         console.error(`Error replicating data to ${node.address}: ${error.message}`);
//       });
//   });
// }

// module.exports = {
//   discoverNodes,
//   replicateData,
// };
