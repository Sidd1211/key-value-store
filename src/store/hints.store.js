const hints = new Map();

export const addHint = (node, data) => {
  if (!hints.has(node)) {
    hints.set(node, []);
  }
  hints.get(node).push(data);
};

export const getHints = (node) => {
  return hints.get(node) || [];
};

export const clearHints = (node) => {
  hints.delete(node);
};