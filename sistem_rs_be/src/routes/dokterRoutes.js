import express from 'express';
import * as DokterController from '../controllers/dokterController.js';

const router = express.Router();

router.get('/', DokterController.getAllDokter);
router.get('/:id', DokterController.getDokterById);
router.post('/', DokterController.createDokter);
router.put('/:id', DokterController.updateDokter);
router.delete('/:id', DokterController.deleteDokter);

export default router;