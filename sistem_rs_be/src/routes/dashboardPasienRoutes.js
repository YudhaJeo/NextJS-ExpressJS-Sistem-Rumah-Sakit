import express from 'express';
import { getStatistikPasien } from '../controllers/dashboardPasienController.js';

const router = express.Router();

router.get('/statistik-pasien', getStatistikPasien);

export default router;
