import express from 'express';
import {
  getAllPasien,
  createPasien,
  updatePasien,
  deletePasien
} from '../controllers/pasienController.js';
import { verifyToken } from '../middlewares/jwt.js';

const router = express.Router();

router.get('/', verifyToken, getAllPasien);
router.post('/', verifyToken, createPasien);
router.put('/:id', verifyToken, updatePasien);
router.delete('/:id', verifyToken, deletePasien);

export default router;