import express from 'express';
import { getRedisInstance, setRedisInstance, deleteRedisInstance } from '../redis.js';
import { replicateData } from '../distributed.js';

const router = express.Router();

router.get('/:key', async (req, res) => {
  const key = req.params.key;
  const value = await getRedisInstance(key);
  res.json({ value });
});

router.post('/', async (req, res) => {
  const { key, value } = req.body;
  await setRedisInstance(key, value);
  await replicateData(key, value);
  res.json({ message: 'Key-value pair added successfully' });
});

router.delete('/:key', async (req, res) => {
  const key = req.params.key;
  await deleteRedisInstance(key);
  // Replicate the deletion to other nodes
  await replicateData(key, null, 'delete');
  res.json({ message: 'Key-value pair deleted successfully' });
});

export default router;
