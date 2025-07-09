// src/routes/bangsalRoutes.js
import express from 'express';
import { getAllBangsal } from '../controllers/bangsalController.js';

const router = express.Router();

router.get('/', getAllBangsal);

export default router;
