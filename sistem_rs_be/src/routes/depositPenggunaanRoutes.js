import express from 'express';
import * as PenggunaanController from '../controllers/depositPenggunaanController.js';

const router = express.Router();

router.get('/', PenggunaanController.getAllPenggunaan);
router.get('/:id', PenggunaanController.getPenggunaanById);
router.post('/', PenggunaanController.createPenggunaan);
router.delete('/:id', PenggunaanController.deletePenggunaan);
router.put('/:id', PenggunaanController.updatePenggunaan);

export default router;
