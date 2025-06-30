import express from 'express';
import { getAllAntrian, createAntrian, panggilAntrian } from '../controllers/antrianController.js';

const router = express.Router();

router.get('/data', getAllAntrian);
router.post('/store', createAntrian);
router.post('/panggil/:id', panggilAntrian);

export default router;
