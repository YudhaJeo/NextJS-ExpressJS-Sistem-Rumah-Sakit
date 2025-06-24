import express from 'express';
import upload from '../middlewares/upload.js';
import { getAllDokumen, createDokumen } from '../controllers/dokumenController.js';

const router = express.Router();

router.get('/', getAllDokumen);
router.post('/', upload.single('file'), createDokumen);

export default router;