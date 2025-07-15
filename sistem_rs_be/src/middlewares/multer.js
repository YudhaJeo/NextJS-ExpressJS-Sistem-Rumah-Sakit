import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Buat folder uploads jika belum ada
const uploadPath = path.join(process.cwd(), 'uploads', 'tenaga_medis');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Filter file hanya untuk gambar & pdf
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.jpg', '.jpeg', '.png', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar (.jpg, .jpeg, .png) dan PDF yang diizinkan!'), false);
  }
};

// Limit ukuran file max 5 MB
const limits = {
  fileSize: 5 * 1024 * 1024, // 5 MB
};

export const upload = multer({
  storage,
  fileFilter,
  limits,
});