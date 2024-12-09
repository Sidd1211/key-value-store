import express from 'express';
import kvRouter from './kv.js';

const router = express.Router();

router.use('/kv', kvRouter);

export default router;
