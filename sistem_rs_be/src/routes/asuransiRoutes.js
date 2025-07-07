// src/routes/asuransiRoutes.js
import express from 'express';
import {
  getAllAsuransi,
  createAsuransi,
  updateAsuransi,
  deleteAsuransi,
} from '../controllers/asuransiController.js';

const router = express.Router();

router.get('/', getAllAsuransi);
router.post('/', createAsuransi);
router.put('/:id', updateAsuransi);
router.delete('/:id', deleteAsuransi);

export default router;
