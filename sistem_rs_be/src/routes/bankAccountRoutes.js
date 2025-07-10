import express from 'express';
import * as BankController from '../controllers/bankAccountController.js';

const router = express.Router();

router.get('/', BankController.getAllBank);
router.post('/', BankController.createBank);
router.put('/:id', BankController.updateBank);
router.delete('/:id', BankController.deleteBank);

export default router;