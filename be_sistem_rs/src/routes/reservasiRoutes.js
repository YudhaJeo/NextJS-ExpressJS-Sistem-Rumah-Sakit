import express from 'express';
import {
  getAllReservasi,
  createReservasi,
  updateReservasi,
  deleteReservasi
} from '../controllers/reservasiController.js';
import { verifyToken } from '../middlewares/jwt.js';

const router = express.Router();

// router.get('/', verifyToken, getAllReservasi);
// router.post('/', verifyToken, createReservasi);
// router.put('/:id', verifyToken, updateReservasi);
// router.delete('/:id', verifyToken, deleteReservasi);

router.get('/', getAllReservasi);
router.post('/', createReservasi);
router.put('/:id', updateReservasi);
router.delete('/:id', deleteReservasi);

export default router;
