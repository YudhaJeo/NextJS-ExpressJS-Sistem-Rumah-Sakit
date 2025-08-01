// sistem_rs_be/src/controllers/profileController.js
import * as ProfileModel from '../models/profileModel.js';

export async function getUser(req, res) {
  try {
    const { id, sumber } = req.user;
    const user = await ProfileModel.getById(id, sumber);

    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });

    delete user.PASSWORD;

    if (sumber === 'medis') {
      user.ROLE = user.JENISTENAGAMEDIS;
    } else if (sumber === 'non_medis') {
      user.ROLE = user.JENISTENAGANONMEDIS;
    }

    user.FOTOPROFIL = user.FOTOPROFIL
      ? `http://localhost:4000${user.FOTOPROFIL}`
      : null;

    // kirim seluruh field user
    res.json({
      data: user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil profil' });
  }
}


export async function updateUser(req, res) {
  try {
    const { id, sumber } = req.user;
    const { NAMALENGKAP, EMAIL, NOHP } = req.body;
    const file = req.file;

    if (!NAMALENGKAP || !EMAIL || !NOHP) {
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

    const data = { NAMALENGKAP, EMAIL, NOHP };

    if (file) {
      data.FOTOPROFIL = `/uploads/${sumber === 'medis' ? 'tenaga_medis' : 'tenaga_non_medis'}/${file.filename}`;
    }

    await ProfileModel.updateProfile(id, sumber, data);
    res.json({ message: 'Profil berhasil diperbarui' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal memperbarui profil' });
  }
}
