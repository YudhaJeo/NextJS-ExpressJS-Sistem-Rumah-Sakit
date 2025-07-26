import * as UserModel from '../models/userModel.js';

export async function getUser(req, res) {
  try {
    const id = req.user.id;
    const sumber = req.user.sumber; 
    const user = await UserModel.getById(id, sumber); 
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });

    delete user.PASSWORD;

    res.json({
      data: {
        username: user.USERNAME,
        email: user.EMAIL,
        role: user.ROLE
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil profil' });
  }
}

export async function updateUser(req, res) {
  try {
    const id = req.user.id;
    const sumber = req.user.sumber; 
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

    await UserModel.updateProfile(id, sumber, { username, email });

    res.json({ message: 'Profil berhasil diperbarui' });
  } catch (err) {
    console.error(err); 
    res.status(500).json({ error: 'Gagal memperbarui profil' });
  }
}