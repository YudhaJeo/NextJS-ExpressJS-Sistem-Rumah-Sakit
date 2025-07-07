import express from 'express';
import * as PendaftaranController from '../controllers/pendaftaranController.js';
import { verifyToken } from '../middlewares/jwt.js';

const router = express.Router();

router.get('/', PendaftaranController.getAllPendaftaran);
router.post('/', PendaftaranController.createPendaftaran);
router.put('/:id', PendaftaranController.updatePendaftaran);
router.delete('/:id', PendaftaranController.deletePendaftaran);


export default router;
