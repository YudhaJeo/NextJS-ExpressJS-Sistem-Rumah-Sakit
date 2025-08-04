import express from 'express';
import * as PembayaranController from '../controllers/pembayaranController.js';

const router = express.Router();

router.get('/', PembayaranController.getAllPembayaran);
router.get('/:id', PembayaranController.getPembayaranById);
router.post('/', PembayaranController.createPembayaran);
router.put('/:id', PembayaranController.updatePembayaran);
router.delete('/:id', PembayaranController.deletePembayaran);

export default router;