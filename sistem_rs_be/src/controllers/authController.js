import * as TenagaMedis from '../models/tenagaMedisModel.js';
import * as TenagaNonMedis from '../models/tenagaNonMedisModel.js';
import { generateToken } from '../utils/jwt.js';
import { loginSchema } from '../schemas/authSchema.js';
import bcrypt from 'bcrypt';

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validasi schema
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    let user = null;
    let userType = '';

    // Coba cari di tabel tenaga medis
    user = await TenagaMedis.findByEmail(email.trim());
    if (user) {
      userType = 'medis';
    } else {
      // Kalau tidak ditemukan, cari di tenaga non-medis
      user = await TenagaNonMedis.findByEmail(email.trim());
      if (user) {
        userType = 'nonmedis';
      }
    }

    // Kalau user tetap tidak ditemukan
    if (!user) {
      return res.status(401).json({ error: 'Email tidak ditemukan' });
    }

    // Debug password dan hasil bcrypt
    console.log('Password dari user:', password);               // dari frontend
    console.log('Password hash di DB:', user.PASSWORD);         // dari DB
    const match = await bcrypt.compare(password, user.PASSWORD);
    console.log('Apakah cocok?', match);                        // true / false

    if (!match) {
      return res.status(401).json({ error: 'Password salah' });
    }

    // Format role agar huruf depan kapital (Superadmin, Dokter, dll)
    const formattedRole = user.NAMAROLE
      ? user.NAMAROLE.charAt(0).toUpperCase() + user.NAMAROLE.slice(1).toLowerCase()
      : 'User';

    // Buat token
    const token = await generateToken({
      id: user.ID,
      role: formattedRole,
      jenisTenaga: userType,
      email: user.EMAIL
    });

    // Kirim response ke frontend
    res.status(200).json({
      token,
      username: user.NAMA || user.NAMALENGKAP || user.USERNAME,
      email: user.EMAIL,
      role: formattedRole,
      jenisTenaga: userType
    });

  } catch (err) {
    console.error('Error login:', err);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
};