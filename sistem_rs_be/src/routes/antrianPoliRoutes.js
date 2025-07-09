import express from 'express';
import * as Controller from '../controllers/antrianPoliController.js';

const router = express.Router();

router.get('/data', Controller.getAllAntrianPoli);
router.post('/store', Controller.createAntrianPoli);
router.post('/panggil/:id', Controller.panggilAntrianPoli);
router.post('/reset', Controller.resetByPoli);

export default router;
