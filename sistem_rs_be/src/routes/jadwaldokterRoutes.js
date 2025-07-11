import express from 'express';
import * as JadwalDokterController from '../controllers/jadwaldokterController.js';

const router = express.Router();

router.get('/', JadwalDokterController.getAll);
router.get('/:id', JadwalDokterController.getById);
router.post('/', JadwalDokterController.create);
router.put('/:id', JadwalDokterController.update);
router.delete('/:id', JadwalDokterController.remove);

export default router;
