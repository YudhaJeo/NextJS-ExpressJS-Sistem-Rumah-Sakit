//controller
import * as KalenderModel from '../models/kalenderModel.js';

export async function getAllKalender(req, res) {
  try {
    const kalenders = await KalenderModel.getAll();
    res.json(kalenders);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function getByIdKalender(req, res) {
  try {
    const id = req.params.id;
    const kalender = await KalenderModel.getById(id);
    if (!kalender) return res.status(404).json({ error: 'Kalender tidak ditemukan' });
    res.json(kalender);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function createKalender(req, res) {
  try {
    const { IDDOKTER, KETERANGAN, TANGGAL, STATUS } = req.body;

    if (!IDDOKTER || !KETERANGAN || !TANGGAL || !STATUS) {
      return res.status(400).json({ error: 'Field wajib tidak boleh kosong' });
    }

    await KalenderModel.create({
      IDDOKTER,
      KETERANGAN,
      TANGGAL,
      STATUS,
    });

    res.status(201).json({ message: 'Kalender berhasil ditambahkan' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function updateKalender(req, res) {
  try {
    const id = req.params.id;
    const { IDDOKTER, KETERANGAN, TANGGAL, STATUS } = req.body;

    const updated = await KalenderModel.update(id, {
      IDDOKTER,
      KETERANGAN,
      TANGGAL,
      STATUS,
    });

    if (!updated) return res.status(404).json({ error: 'Kalender tidak ditemukan' });

    res.json({ message: 'Kalender berhasil diperbarui' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function removeKalender(req, res) {
  try {
    const id = req.params.id;
    const deleted = await KalenderModel.remove(id);
    if (!deleted) return res.status(404).json({ error: 'Kalender tidak ditemukan' });
    res.json({ message: 'Kalender berhasil dihapus' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
}
