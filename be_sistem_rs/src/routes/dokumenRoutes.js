import express from 'express';
import upload from '../middlewares/upload.js';
import { getAllDokumen, createDokumen, updateDokumen, deleteDokumen } from '../controllers/dokumenController.js';

const router = express.Router();

router.get('/', getAllDokumen);
router.post('/', upload.single('file'), createDokumen);
router.put('/:id', upload.single('file'), updateDokumen);
router.delete('/:id', deleteDokumen);

export default router;