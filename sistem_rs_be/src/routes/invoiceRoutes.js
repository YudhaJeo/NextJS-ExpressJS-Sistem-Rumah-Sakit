import express from 'express';
import * as InvoiceController from '../controllers/invoiceController.js';
import { verifyToken } from '../middlewares/jwt.js';

const router = express.Router();

router.get('/', InvoiceController.getAllInvoice);
router.get('/:id', InvoiceController.getInvoiceById);
router.post('/', InvoiceController.createInvoice);
router.put('/:id', InvoiceController.updateInvoice);
router.delete('/:id', InvoiceController.deleteInvoice);

export default router;