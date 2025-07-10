// src/routes/bedRoutes.js
import express from 'express';
import * as BedController from '../controllers/bedController.js';

const router = express.Router();

router.get('/', BedController.getAllBed);
router.post('/', BedController.createBed);
router.put('/:id', BedController.updateBed);

export default router;