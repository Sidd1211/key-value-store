import * as kvService from '../../services/kv.service.js';

//
// 🔹 EXTERNAL APIs
//
export const setKey = async (req, res) => {
  try {
    const { key, value } = req.body;

    if (!key) {
      return res.status(400).json({ error: "Key required" });
    }

    await kvService.setKey(key, value);

    res.json({ message: "Stored successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getKey = async (req, res) => {
  try {
    const value = await kvService.getKey(req.params.key);
    res.json({ value });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteKey = async (req, res) => {
  try {
    await kvService.deleteKey(req.params.key);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//
// 🔹 INTERNAL APIs (CRITICAL)
//
export const setKeyInternal = async (req, res) => {
  try {
    const { key, value, vectorClock } = req.body;

    await kvService.setKeyLocal(key, value, vectorClock);

    res.json({ message: "Replicated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getKeyInternal = async (req, res) => {
  try {
    const data = kvService.getKeyLocal
      ? kvService.getKeyLocal(req.params.key)
      : null;

    res.json(data || null); // MUST return full object
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteKeyInternal = async (req, res) => {
  try {
    await kvService.deleteKeyLocal(req.params.key);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};