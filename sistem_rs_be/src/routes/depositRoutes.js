import express from 'express';
import * as DepositController from '../controllers/depositController.js';

const router = express.Router();

router.get('/', DepositController.getAllDeposit);
router.get('/options', DepositController.getDepositOptions);
router.get('/:id', DepositController.getDepositById);
router.post('/', DepositController.createDeposit);
router.put('/:id', DepositController.updateDeposit);
router.delete('/:id', DepositController.deleteDeposit);

export default router;