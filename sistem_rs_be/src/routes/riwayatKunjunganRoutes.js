import express from 'express';
import * as KunjunganController from '../controllers/riwayatKunjunganController.js';

const router = express.Router();

router.get('/', KunjunganController.getRiwayatKunjungan);

export default router;