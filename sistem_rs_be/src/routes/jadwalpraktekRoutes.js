import express from 'express';
import * as JadwalController from '../controllers/jadwalpraktekController.js';

const router = express.Router();

router.get('/', JadwalController.getAllJadwal);
router.get('/:id', JadwalController.getByIdJadwal);
router.post('/', JadwalController.createJadwal);
router.put('/:id', JadwalController.updateJadwal);
router.delete('/:id', JadwalController.removeJadwal);

export default router;
