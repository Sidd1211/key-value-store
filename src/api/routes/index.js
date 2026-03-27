import express from 'express';
import kvRoutes from './kv.routes.js';
import healthRoutes from './health.routes.js';
import gossipRoutes from './gossip.routes.js';

const router = express.Router();

router.use('/kv', kvRoutes);
router.use('/health', healthRoutes);
router.use('/gossip', gossipRoutes);

export default router;