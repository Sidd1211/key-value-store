import express from 'express';
import { getAllNodes } from '../../store/cluster.store.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    nodes: getAllNodes()
  });
});

export default router;