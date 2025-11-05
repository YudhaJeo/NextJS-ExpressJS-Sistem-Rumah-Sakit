import express from 'express';
import { getDashboardInformasi } from '../controllers/dashboardMobileController.js';

const router = express.Router();

router.get('/', getDashboardInformasi);

export default router;
