import db from '../core/config/knex.js';

export const getRolesTenagaMedis = async (req, res) => {
  try {
    const roles = await db('role')
      .where('JENISROLE', 'Tenaga Medis')
      .select('NAMAROLE');

    res.status(200).json({ success: true, data: roles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Gagal mengambil role tenaga medis' });
  }
};

export const getRolesTenagaNonMedis = async (req, res) => {
  try {
    const roles = await db('role')
      .where('JENISROLE', 'Non Medis')
      .select('NAMAROLE');

    res.status(200).json({ success: true, data: roles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Gagal mengambil role tenaga medis' });
  }
};

export const getRoles = async (req, res) => {
  try {
    const roles = await db('ROLE').select('*');
    res.status(200).json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil data role' });
  }
};

export const getRole = async (req, res) => {
  try {
    const role = await db('ROLE')
      .where({ IDROLE: req.params.id })
      .first();

    if (!role) return res.status(404).json({ message: 'Role tidak ditemukan' });
    res.status(200).json(role);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil data role' });
  }
};