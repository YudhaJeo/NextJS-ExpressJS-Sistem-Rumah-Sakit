import * as ProfileModel from '../models/profileModel.js';
import { uploadToMinio } from '../utils/uploadMinio.js';
import { deleteFromMinio } from '../utils/deleteMinio.js';

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

    user.FOTOPROFIL = user.FOTOPROFIL || null;

    res.json({ data: user });
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
      const oldUser = await ProfileModel.getById(id, sumber);
      if (oldUser?.FOTOPROFIL) {
        await deleteFromMinio(oldUser.FOTOPROFIL);
      }

      const folder = sumber === 'medis'
        ? 'tenaga_medis/foto_profile'
        : 'tenaga_non_medis/foto_profile';

      data.FOTOPROFIL = await uploadToMinio(file, folder);
    }

    await ProfileModel.updateProfile(id, sumber, data);
    res.json({ message: 'Profil berhasil diperbarui' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal memperbarui profil' });
  }
}
