const cluster = new Map();

export const updateNode = (node, status = 'alive') => {
  cluster.set(node, {
    status,
    lastSeen: Date.now()
  });
};

export const getAllNodes = () => {
  return Array.from(cluster.keys());
};

export const getAliveNodes = () => {
  return Array.from(cluster.entries())
    .filter(([_, v]) => v.status === 'alive')
    .map(([k]) => k);
};