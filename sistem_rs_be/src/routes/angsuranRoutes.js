import express from 'express';
import * as AngsuranController from '../controllers/angsuranController.js';

const router = express.Router();

router.get('/', AngsuranController.getAllAngsuran);
router.get('/invoice/:idInvoice', AngsuranController.getAngsuranByInvoice);
router.get('/:id', AngsuranController.getAngsuranById);
router.post('/', AngsuranController.createAngsuran);
router.put('/:id', AngsuranController.updateAngsuran);
router.delete('/:id', AngsuranController.deleteAngsuran);

export default router;
