import express from 'express';
import * as InvoiceController from '../controllers/invoiceController.js';

const router = express.Router();

router.get('/', InvoiceController.getAllInvoice);
router.get('/options', InvoiceController.getInvoiceOptions);
router.get('/:id', InvoiceController.getInvoiceById);
router.put('/:id', InvoiceController.updateInvoice);
router.delete('/:id', InvoiceController.deleteInvoice);

export default router;