import express from 'express';
import * as PengobatanController from '../controllers/riwayatPengobatanController.js';
import { verifyToken } from '../middlewares/jwt.js';

const router = express.Router();

router.get('/', PengobatanController.getAllPengobatan);
router.post('/', PengobatanController.createPengobatan);
router.put('/:id', PengobatanController.updatePengobatan);
router.delete('/:id', PengobatanController.deletePengobatan);

export default router;