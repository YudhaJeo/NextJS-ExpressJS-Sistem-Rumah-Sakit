import express from 'express';
import { getDashboardDokter } from '../controllers/dashboardDokterController.js';

const router = express.Router();

router.get('/', getDashboardDokter);

export default router;