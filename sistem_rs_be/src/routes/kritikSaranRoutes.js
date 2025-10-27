import express from 'express';
import * as KritikSaranController from '../controllers/kritikSaranController.js';

const router = express.Router();

router.get('/', KritikSaranController.getAllKritikSaran);
router.get('/:id', KritikSaranController.getKritikSaranById);

export default router;
