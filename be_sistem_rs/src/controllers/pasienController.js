import * as PasienModel from '../models/pasienModel.js';

export async function getAllPasien(req, res) {
  try {
    const pasien = await PasienModel.getAll();
    res.json({ data: pasien });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createPasien(req, res) {
  try {
    const { NAMA, NIK, TGLLAHIR, JK, ALAMAT, NOHP, EMAIL } = req.body;
    await PasienModel.create({ NAMA, NIK, TGLLAHIR, JK, ALAMAT, NOHP, EMAIL });
    res.json({ message: 'Pasien berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updatePasien(req, res) {
    console.log("Update data:", req.body);
  try {
    const id = req.params.id;
    const { NAMA, NIK, TGLLAHIR, JK, ALAMAT, NOHP, EMAIL } = req.body;
    await PasienModel.update(id, { NAMA, NIK, TGLLAHIR, JK, ALAMAT, NOHP, EMAIL });
    res.json({ message: 'Pasien berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deletePasien(req, res) {
  try {
    const id = req.params.id;
    await PasienModel.remove(id);
    res.json({ message: 'Pasien berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
