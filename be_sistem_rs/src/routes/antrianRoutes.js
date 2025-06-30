import express from 'express';
import { getAllAntrian, panggilAntrian } from '../controllers/antrianController.js';

const router = express.Router();

router.get('/data', getAllAntrian);
router.post('/panggil/:id', panggilAntrian);

export default router;
