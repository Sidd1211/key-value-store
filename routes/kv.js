const express = require('express');
const redis = require('../redis');
const { replicateData } = require('../distributed');

const router = express.Router();

router.get('/:key', async (req, res) => {
  const key = req.params.key;
  const value = await redis.get(key);
  res.json({ value });
});

router.post('/', async (req, res) => {
  const { key, value } = req.body;
  await redis.set(key, value);
  await replicateData(key, value);
  res.json({ message: 'Key-value pair added successfully' });
});

router.delete('/:key', async (req, res) => {
  const key = req.params.key;
  await redis.delete(key);
  // Replicate the deletion to other nodes
  await replicateData(key, null, 'delete');
  res.json({ message: 'Key-value pair deleted successfully' });
});

module.exports = router;