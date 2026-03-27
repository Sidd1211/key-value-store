const store = new Map();

export const setValue = (key, value, vectorClock) => {
  store.set(key, { value, vectorClock });
};

export const getValue = (key) => {
  return store.get(key);
};

export const deleteValue = (key) => {
  store.delete(key);
};

export const getAll = () => {
  return Object.fromEntries(store);
};