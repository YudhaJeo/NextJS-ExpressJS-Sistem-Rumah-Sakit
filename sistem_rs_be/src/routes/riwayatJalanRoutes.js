// D:\MARSTECH\NextJS-ExpressJS-Final-System\sistem_rs_be\src\routes\riwayatJalanRoutes.js
import express from 'express';
import * as RiwayatJalanController from '../controllers/riwayatJalanController.js';

const router = express.Router();

router.get('/', RiwayatJalanController.getAllRiwayatJalan);
router.get('/:id', RiwayatJalanController.getRiwayatJalanById);

export default router;