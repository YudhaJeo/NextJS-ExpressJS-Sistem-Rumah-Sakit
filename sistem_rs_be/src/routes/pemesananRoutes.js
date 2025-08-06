import express from 'express';
import * as PemesananController from '../controllers/pemesananController.js';

const router = express.Router();

router.get('/', PemesananController.index);
router.post('/', PemesananController.store);
router.put('/:id/status', PemesananController.updateStatus);
router.get('/:id', PemesananController.show);

export default router;