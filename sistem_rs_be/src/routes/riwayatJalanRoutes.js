import express from 'express';
import * as RiwayatJalanController from '../controllers/riwayatJalanController.js';

const router = express.Router();

router.get('/', RiwayatJalanController.getAllRiwayatJalan);
router.get('/:id', RiwayatJalanController.getRiwayatJalanById);

export default router;