import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getAllDokumen,
  getDokumenByNIK,
  getDokumenById,
  createDokumen,
  deleteDokumen,
} from '../controllers/dokumenController.js';

const router = express.Router();

// Setup Multer untuk upload file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/dokumen/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Routes
router.get('/', getAllDokumen);
router.get('/:nik', getDokumenByNIK);
router.get('/detail/:id', getDokumenById);
router.post('/', upload.single('file'), createDokumen);
router.delete('/:id', deleteDokumen);

export default router;