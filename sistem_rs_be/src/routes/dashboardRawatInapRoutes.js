import express from 'express';
import { getRawatInapDashboard } from '../controllers/dashboardRawatInapController.js';

const router = express.Router();

router.get('/', getRawatInapDashboard);

export default router;