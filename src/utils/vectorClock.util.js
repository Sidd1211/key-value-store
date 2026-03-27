export const incrementClock = (clock = {}, nodeId) => {
  return {
    ...clock,
    [nodeId]: (clock[nodeId] || 0) + 1
  };
};

export const compareClocks = (a = {}, b = {}) => {
  let aGreater = false;
  let bGreater = false;

  const nodes = new Set([...Object.keys(a), ...Object.keys(b)]);

  for (let node of nodes) {
    const av = a[node] || 0;
    const bv = b[node] || 0;

    if (av > bv) aGreater = true;
    if (bv > av) bGreater = true;
  }

  if (aGreater && !bGreater) return 1;
  if (!aGreater && bGreater) return -1;
  return 0; // conflict
};