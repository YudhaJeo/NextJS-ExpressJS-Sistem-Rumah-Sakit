// src\routes\tagihanSementaraRoutes.js
import express from 'express';
import TagihanSementaraController from '../controllers/tagihanSementaraController.js';

const router = express.Router();

router.get('/', TagihanSementaraController.getAll);

export default router;
