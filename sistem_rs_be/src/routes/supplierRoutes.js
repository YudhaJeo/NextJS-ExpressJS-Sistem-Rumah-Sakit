import express from 'express';
import * as SupplierController from '../controllers/supplierController.js';

const router = express.Router();

router.get('/', SupplierController.getAllSupplier);
router.post('/', SupplierController.createSupplier);
router.put('/:id', SupplierController.updateSupplier);
router.delete('/:id', SupplierController.deleteSupplier);

export default router;
