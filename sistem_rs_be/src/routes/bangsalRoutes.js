// src/routes/bangsalRoutes.js
import express from 'express';
import {
  getAllBangsal,
  createBangsal,
  updateBangsal,
  deleteBangsal
} from '../controllers/bangsalController.js';

const router = express.Router();

router.get('/', getAllBangsal);
router.post('/', createBangsal);
router.put('/:id', updateBangsal);
router.delete('/:id', deleteBangsal);

export default router;
