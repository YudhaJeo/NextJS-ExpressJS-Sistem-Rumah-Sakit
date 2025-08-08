import express from 'express';
import * as DashboardApotekController from '../controllers/dashboardApotekController.js';

const router = express.Router();

router.get('/', DashboardApotekController.index);

export default router;