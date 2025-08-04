import express from 'express';
import * as RiwayatInapController from '../controllers/riwayatInapController.js';

const router = express.Router();

router.get('/', RiwayatInapController.getAllRiwayatInap);
router.get('/:id', RiwayatInapController.getRiwayatInapById);

export default router;