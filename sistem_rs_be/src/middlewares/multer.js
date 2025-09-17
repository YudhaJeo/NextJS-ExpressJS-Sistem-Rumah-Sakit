import multer from 'multer';
import path from 'path';
import fs from 'fs';

const getUploadPath = (req) => {
  let folder = 'uploads/other';

  if (req.baseUrl.includes('tenaga_non_medis')) {
    folder = 'uploads/tenaga_non_medis';
  } else if (req.baseUrl.includes('tenaga_medis')) {
    folder = 'uploads/tenaga_medis';
  } else if (req.baseUrl.includes('rawat_jalan')) {
    folder = 'uploads/rawat_jalan';
  }

  const uploadPath = path.join(process.cwd(), folder);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  return uploadPath;
};


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, getUploadPath(req));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.jpg', '.jpeg', '.png', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar (.jpg, .jpeg, .png) dan PDF yang diizinkan!'), false);
  }
};

const limits = {
  fileSize: 5 * 1024 * 1024,
};

export const upload = multer({
  storage,
  fileFilter,
  limits,
});
