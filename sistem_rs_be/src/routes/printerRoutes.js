import express from 'express';
import * as PrinterController from '../controllers/printerController.js';
import { verifyToken } from '../middlewares/jwt.js';

const router = express.Router();

router.get('/', PrinterController.getAllPrinter);
router.post('/', PrinterController.createPrinter);
router.put('/:id', PrinterController.updatePrinter);
router.delete('/:id', PrinterController.deletePrinter);

export default router;
