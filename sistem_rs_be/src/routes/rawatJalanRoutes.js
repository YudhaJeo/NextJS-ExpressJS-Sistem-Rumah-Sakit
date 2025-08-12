import express from 'express';
import * as RawatJalanController from '../controllers/rawatJalanController.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.get('/', RawatJalanController.getAllRawatJalan);
router.post('/', upload.single('FOTORESEP'), RawatJalanController.createRawatJalan);
router.put('/:id', upload.single('FOTORESEP'), RawatJalanController.updateRawatJalan);
router.delete('/:id', RawatJalanController.deleteRawatJalan);

export default router;