// src/controllers/bangsalController.js
import * as Bangsal from '../models/bangsalModel.js';

export async function getAllBangsal(req, res) {
  try {
    const data = await Bangsal.getAll();
    res.json({ data });
  } catch (err) {
    console.error('Gagal ambil bangsal:', err);
    res.status(500).json({ error: 'Gagal mengambil data bangsal' });
  }
}
