import express from 'express';
import * as PenjualanController from '../controllers/penjualanController.js';

const router = express.Router();

router.get('/', PenjualanController.index);
router.post('/', PenjualanController.store);

export default router;