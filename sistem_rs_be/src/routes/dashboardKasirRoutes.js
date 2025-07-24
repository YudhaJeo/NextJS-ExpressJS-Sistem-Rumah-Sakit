import express from 'express';
import { getDashboardKasir } from '../controllers/dashboardKasirController.js';

const router = express.Router();

router.get('/', getDashboardKasir);

export default router;