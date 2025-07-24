import express from 'express';
import { verifyToken } from '../middlewares/jwt.js';

const router = express.Router();

router.get('/', verifyToken, (req, res) => {
  const userRole = req.user.role;

  if (userRole === 'Dokter') {
    return res.json({ message: 'Halo Dokter, ini data khusus Anda.' });
  }

  if (userRole === 'Perawat') {
    return res.json({ message: 'Halo Perawat, ini data untuk Anda.' });
  }

  if (userRole === 'Super Admin') {
    return res.json({ message: 'Halo Super Admin, Anda punya akses penuh.' });
  }

  return res.status(403).json({ message: 'Role tidak dikenali atau tidak diizinkan.' });
});

export default router;