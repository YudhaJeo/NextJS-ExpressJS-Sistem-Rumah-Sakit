// src/routes/kamarRoutes.js
import express from 'express';
import * as KamarController from '../controllers/kamarController.js';

const router = express.Router();

router.get('/', KamarController.getAllKamar);
router.post('/', KamarController.createKamar);
router.put('/:id', KamarController.updateKamar);
router.delete('/:id', KamarController.deleteKamar);

export default router;