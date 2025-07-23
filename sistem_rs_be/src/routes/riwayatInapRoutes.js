// sistem_rs_be\src\routes\riwayatInapRoutes.js
import express from 'express';
import * as RiwayatInapController from '../controllers/riwayatInapController.js';

const router = express.Router();

router.get('/', RiwayatInapController.getAllRiwayatInap);

export default router;