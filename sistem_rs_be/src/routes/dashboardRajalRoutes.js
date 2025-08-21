import express from 'express';
import { getDashboardRajal } from '../controllers/dashboardRajalController.js';

const router = express.Router();

router.get('/', getDashboardRajal);

export default router;