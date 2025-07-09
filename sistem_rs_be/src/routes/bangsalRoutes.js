// src/routes/bangsalRoutes.js
import express from 'express';
import {
  getAllBangsal,
  createBangsal,
  updateBangsal,
} from '../controllers/bangsalController.js';

const router = express.Router();

router.get('/', getAllBangsal);
router.post('/', createBangsal);
router.put('/:id', updateBangsal);

export default router;
