import express from 'express';
import * as KunjunganController from '../controllers/riwayatKunjunganController.js';

const router = express.Router();

router.get('/', KunjunganController.getRiwayatKunjungan);
router.get('/detail/:nik', KunjunganController.getDetailRiwayat);

export default router;