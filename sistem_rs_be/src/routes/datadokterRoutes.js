import express from 'express';
import * as DataDokterController from '../controllers/datadokterController.js';

const router = express.Router();

router.get('/', DataDokterController.getAll);
router.get('/:id', DataDokterController.getById);
router.post('/', DataDokterController.create);
router.put('/:id', DataDokterController.update);
router.delete('/:id', DataDokterController.remove);

export default router;
