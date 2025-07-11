import express from 'express';
import * as MetodeController from '../controllers/metodePembayaranController.js';

const router = express.Router();

router.get('/', MetodeController.getAllMetode);
router.post('/', MetodeController.createMetode);
router.put('/:id', MetodeController.updateMetode);
router.delete('/:id', MetodeController.deleteMetode);
router.get('/aktif', MetodeController.getAktif);

export default router;