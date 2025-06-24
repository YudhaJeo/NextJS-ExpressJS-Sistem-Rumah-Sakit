import express from 'express';
import {
  getAllReservasi,
  createReservasi,
  updateReservasi,
  deleteReservasi
} from '../controllers/reservasiController.js';

const router = express.Router();

router.get('/', getAllReservasi);
router.post('/', createReservasi);
router.put('/:id', updateReservasi);
router.delete('/:id', deleteReservasi);

export default router;
