import express from 'express';
import * as PendaftaranController from '../controllers/pendaftaranController.js';
import { verifyToken } from '../middlewares/jwt.js';

const router = express.Router();

router.get('/', verifyToken, PendaftaranController.getAllPendaftaran);
router.post('/', verifyToken, PendaftaranController.createPendaftaran);
router.put('/:id', verifyToken, PendaftaranController.updatePendaftaran);
router.delete('/:id', verifyToken, PendaftaranController.deletePendaftaran);

export default router;
