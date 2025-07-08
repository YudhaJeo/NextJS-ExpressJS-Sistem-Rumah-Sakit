// src/controllers/jenisKamarController.js
import * as JenisKamar from '../models/jenisKamarModel.js';

export async function getAllJenisKamar(req, res) {
  try {
    const data = await JenisKamar.getAll();
    res.json({ data });
  } catch (err) {
    console.error('Gagal get jenis kamar:', err);
    res.status(500).json({ error: err.message });
  }
}


export async function createJenisKamar(req, res) {
  try {
    const { NAMAJENIS, HARGA_PER_HARI, FASILITAS } = req.body;

    if (!NAMAJENIS) {
      return res.status(400).json({ error: 'Jenis kamar wajib diisi' });
    }

    await JenisKamar.create({ NAMAJENIS, HARGA_PER_HARI, FASILITAS });

    res.json({ message: 'Jenis Kamar berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


export async function updateJenisKamar(req, res) {
  try {
    const id = req.params.id;
    const { NAMAJENIS, HARGA_PER_HARI, FASILITAS } = req.body;

    const existing = await JenisKamar.getById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Data jenis kamar tidak ditemukan' });
    }

    await JenisKamar.update(id, { NAMAJENIS, HARGA_PER_HARI, FASILITAS });
    res.json({ message: 'Jenis kamar berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}