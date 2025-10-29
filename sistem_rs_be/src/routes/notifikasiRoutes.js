// D:\MARSTECH\NextJS-ExpressJS-Final-System\sistem_rs_be\src\routes\notifikasiRoutes.js
import express from 'express';
import * as NotifikasiController from '../controllers/notifikasiController.js';

const router = express.Router();

router.get('/', NotifikasiController.getAllNotifikasi);

export default router;
