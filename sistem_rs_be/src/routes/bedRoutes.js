// src/routes/bedRoutes.js
import express from 'express';
import * as BedController from '../controllers/bedController.js';

const router = express.Router();

router.get('/', BedController.getAllBed);

export default router;