import express from 'express';
import * as Controller from '../controllers/antrianPoliController.js';

const router = express.Router();

router.get('/', Controller.getAllAntrianPoli);
router.post('/', Controller.createAntrianPoli);
router.post('/panggil/:id', Controller.panggilAntrianPoli);

export default router;
