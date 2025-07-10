// src/controllers/kamarlController.js
import * as KamarModel from '../models/kamarModel.js';

export async function getAllKamar(req, res) {
  try {
    const data = await KamarModel.getAll();
    res.json({ data });
  } catch (err) {
    console.error('Gagal ambil kamar:', err);
    res.status(500).json({ error: 'Gagal mengambil data kamar' });
  }
}

export async function createKamar(req, res) {
  try {
    const { NAMAKAMAR, IDBANGSAL, KAPASITAS, KETERANGAN } = req.body;

    const existing = await KamarModel.getByNama(NAMAKAMAR);
    if (existing) {
      return res.status(400).json({ error: 'Nama kamar sudah terdaftar' });
    }

    await KamarModel.create({
      NAMAKAMAR,
      IDBANGSAL,
      KAPASITAS,
      KETERANGAN,
    });

    res.json({ message: 'Kamar berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateKamar(req, res) {
  try {
    const { id } = req.params;
    const { NAMAKAMAR, IDBANGSAL, KAPASITAS, KETERANGAN } = req.body;

    const updated = await KamarModel.update(id, {
      NAMAKAMAR,
      IDBANGSAL,
      KAPASITAS,
      KETERANGAN,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Kamar tidak ditemukan' });
    }

    res.json({ message: 'Kamar berhasil diperbarui' });
  } catch (err) {
    console.error('Gagal update kamar:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function deleteKamar(req, res) {
  try {
    const { id } = req.params;
    const deleted = await KamarModel.deleteById(id);

    if (deleted === 0) {
      return res.status(404).json({ error: 'Kamar tidak ditemukan' });
    }

    res.json({ message: 'Kamar berhasil dihapus' });
  } catch (err) {
    console.error('Gagal hapus kamar:', err);
    res.status(500).json({ error: 'Gagal menghapus kamar' });
  }
}
