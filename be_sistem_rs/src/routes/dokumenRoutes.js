import express from 'express';
import upload from '../middlewares/upload.js';
import {
  getAllDokumen,
  createDokumen,
  updateDokumen,
  deleteDokumen
} from '../controllers/dokumenController.js';
import { verifyToken } from '../middlewares/jwt.js';
import path from 'path';
import fs from 'fs';
import { __dirname } from '../utils/dirName.js';
import { downloadById } from '../controllers/dokumenController.js';

const router = express.Router();

router.get('/', getAllDokumen);
router.post('/', upload.single('file'), createDokumen);
router.put('/:id', upload.single('file'), updateDokumen);
router.delete('/:id', deleteDokumen);
router.get('/download-by-id/:id', downloadById);
router.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '..', 'uploads', 'dokumen', filename);

  if (fs.existsSync(filePath)) {
    return res.download(filePath);
  } else {
    return res.status(404).json({ message: 'File tidak ditemukan' });
  }
});

export default router;