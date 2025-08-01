// sistem_rs_be/src/routes/profileRoutes.js
import express from 'express';
import { getUser, updateUser } from '../controllers/profileController.js';
import { verifyToken } from '../middlewares/jwt.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// konfigurasi folder upload dinamis berdasarkan sumber
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const sumber = req.user?.sumber === 'medis' ? 'tenaga_medis' : 'tenaga_non_medis';
    const dir = path.join('uploads', sumber);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.get('/', verifyToken, getUser);
router.put('/', verifyToken, upload.single('file'), updateUser);

export default router;
