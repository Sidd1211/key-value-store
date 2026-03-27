import express from 'express';
import * as kvController from '../controllers/kv.controller.js';

const router = express.Router();

router.get('/:key', kvController.getKey);
router.post('/', kvController.setKey);
router.delete('/:key', kvController.deleteKey);
router.post('/internal', kvController.setKeyInternal);
router.get('/internal/:key', kvController.getKeyInternal);
router.delete('/internal/:key', kvController.deleteKeyInternal);
export default router;