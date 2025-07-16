import express from 'express';
import * as ReservasiController from '../controllers/reservasiController.js';

const router = express.Router();

router.get('/', ReservasiController.getAllReservasi);
router.post('/', ReservasiController.createReservasi);
router.put('/:id', ReservasiController.updateReservasi);
router.delete('/:id', ReservasiController.deleteReservasi);

export default router;
