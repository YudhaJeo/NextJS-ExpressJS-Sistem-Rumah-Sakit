import express from 'express';
import { getRuanganDashboard, getRawatInapDashboard } from '../controllers/dashboardRawatInapController.js';

const router = express.Router();

router.get('/ruangan', getRuanganDashboard);
router.get('/rawatinap', getRawatInapDashboard);

export default router;