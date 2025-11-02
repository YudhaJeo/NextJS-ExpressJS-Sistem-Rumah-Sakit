import express from 'express';
import * as NotifikasiController from '../controllers/notifikasiController.js';

const router = express.Router();

router.get('/', NotifikasiController.getAllNotifikasi);

export default router;
