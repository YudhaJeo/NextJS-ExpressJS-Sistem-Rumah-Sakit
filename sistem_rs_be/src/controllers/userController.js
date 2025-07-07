// src/controllers/userController.js
import * as UserModel from '../models/userModel.js';

export async function getUser(req, res) {
  try {
    const id = req.user.id;
    const user = await UserModel.getById(id);
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });
    delete user.PASSWORD;
    // kirim hanya field yang frontend butuh
    res.json({ data: {
      username: user.USERNAME,
      email:    user.EMAIL,
      role:     user.ROLE
    }});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil profil' });
  }
}

export async function updateUser(req, res) {
  try {
    const id = req.user.id;
    const { username, email, role } = req.body;
    if (!username || !email || !role) {
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }
    await UserModel.updateProfile(id, { username, email, role });
    res.json({ message: 'Profil berhasil diperbarui' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal memperbarui profil' });
  }
}
