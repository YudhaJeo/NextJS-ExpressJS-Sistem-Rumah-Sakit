import * as UserModel from '../models/userModel.js';

export const getUser = async (req, res) => {
  try {
    const payload = req.user;
    console.log('📌 Payload:', payload);

    if (!payload || !payload.id || !payload.jenisTenaga) {
      return res.status(400).json({ message: 'Informasi user tidak lengkap dalam token.' });
    }

    const id = payload.id;
    const jenis = payload.jenisTenaga;

    let user;

    if (jenis === 'medis') {
      user = await db('tenaga_medis')
        .join('master_role', 'tenaga_medis.ROLE', 'master_role.IDROLE')
        .select(
          'tenaga_medis.IDTENAGAMEDIS as ID',
          'tenaga_medis.NAMA',
          'tenaga_medis.EMAIL',
          'tenaga_medis.ROLE',
          'master_role.NAMA_ROLE',
          db.raw("'medis' as jenisTenaga")
        )
        .where('tenaga_medis.IDTENAGAMEDIS', id)
        .first();
    } else if (jenis === 'nonmedis') {
      user = await db('tenaga_non_medis')
        .join('master_role', 'tenaga_non_medis.ROLE', 'master_role.IDROLE')
        .select(
          'tenaga_non_medis.IDTENAGANONMEDIS as ID',
          'tenaga_non_medis.NAMA',
          'tenaga_non_medis.EMAIL',
          'tenaga_non_medis.ROLE',
          'master_role.NAMA_ROLE',
          db.raw("'nonmedis' as jenisTenaga")
        )
        .where('tenaga_non_medis.IDTENAGANONMEDIS', id)
        .first();
    } else {
      return res.status(400).json({ message: 'Jenis tenaga tidak valid.' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('❌ Gagal mengambil user:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil user.' });
  }
};

export async function updateUser(req, res) {
  try {
    const id = req.user.id;
    const { username, email} = req.body;
    if (!username || !email) {
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }
    await UserModel.updateProfile(id, { username, email});
    res.json({ message: 'Profil berhasil diperbarui' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal memperbarui profil' });
  }
}
