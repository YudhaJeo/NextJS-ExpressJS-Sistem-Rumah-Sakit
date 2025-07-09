// src/controllers/bangsalController.js
import * as BangsalModel from '../models/bangsalModel.js';

export async function getAllBangsal(req, res) {
  try {
    const data = await BangsalModel.getAll();
    res.json({ data });
  } catch (err) {
    console.error('Gagal ambil bangsal:', err);
    res.status(500).json({ error: 'Gagal mengambil data bangsal' });
  }
}

export async function createBangsal(req, res) {
  try {
    const { NAMABANGSAL, IDJENISBANGSAL, KAPASITAS, TERISI, STATUS, KETERANGAN } = req.body;

    const existing = await BangsalModel.getByNama(NAMABANGSAL);
    if (existing) {
      return res.status(400).json({ error: 'Nama bangsal sudah terdaftar' });
    }

    await BangsalModel.create({
      NAMABANGSAL,
      IDJENISBANGSAL,
      KAPASITAS,
      TERISI,
      STATUS,
      KETERANGAN,
    });

    res.json({ message: 'Bangsal berhasil ditambahkan' });
  } catch (err) {
    console.error('Gagal tambah bangsal:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function updateBangsal(req, res) {
  try {
    const { id } = req.params;
    const { NAMABANGSAL, IDJENISBANGSAL, KAPASITAS, TERISI, STATUS, KETERANGAN } = req.body;

    const updated = await BangsalModel.update(id, {
      NAMABANGSAL,
      IDJENISBANGSAL,
      KAPASITAS,
      TERISI,
      STATUS,
      KETERANGAN,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Bangsal tidak ditemukan' });
    }

    res.json({ message: 'Bangsal berhasil diperbarui' });
  } catch (err) {
    console.error('Gagal update bangsal:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function deleteBangsal(req, res) {
  try {
    const { id } = req.params;
    const deleted = await BangsalModel.deleteById(id);

    if (deleted === 0) {
      return res.status(404).json({ error: 'Bangsal tidak ditemukan' });
    }

    res.json({ message: 'Bangsal berhasil dihapus' });
  } catch (err) {
    console.error('Gagal hapus bangsal:', err);
    res.status(500).json({ error: 'Gagal menghapus bangsal' });
  }
}
