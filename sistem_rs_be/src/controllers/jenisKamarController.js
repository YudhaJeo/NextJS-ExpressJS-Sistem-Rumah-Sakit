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
