// src/controllers/authController.js
import { findUserByEmail } from '../models/authModel.js';
import { generateToken } from '../utils/jwt.js';
import { loginSchema } from '../schemas/authSchema.js';
import { comparePassword } from '../utils/hash.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validasi
  const { error } = loginSchema.validate({ email, password });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const user = await findUserByEmail(email.trim());

    // Cek akun
    if (!user || user.PASSWORD !== password.trim()) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    // Generate token
    const token = generateToken({ id: user.ID, role: user.ROLE, email: user.EMAIL });
    res.status(200).json({ message: 'Login berhasil', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
};
