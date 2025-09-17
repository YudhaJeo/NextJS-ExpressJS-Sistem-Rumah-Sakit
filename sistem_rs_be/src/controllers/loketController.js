import * as LoketModel from '../models/loketModel.js';

export async function getAllLoket(req, res) {
  try {
    const loket = await LoketModel.getAll();
    res.json({ data: loket });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createLoket(req, res) {
  try {
    const { NAMALOKET, KODE, DESKRIPSI } = req.body;

    await LoketModel.create({ NAMALOKET, KODE, DESKRIPSI });

    res.json({ message: 'Loket berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateLoket(req, res) {
  try {
    const id = req.params.id;

    const existing = await LoketModel.getById(id);
    if (!existing) return res.status(404).json({ error: 'Loket tidak ditemukan' });

    const { NAMALOKET, KODE, DESKRIPSI } = req.body;

    await LoketModel.update(id, { NAMALOKET, KODE, DESKRIPSI });

    res.json({ message: 'Loket berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteLoket(req, res) {
  try {
    const id = req.params.id;
    await LoketModel.remove(id);
    res.json({ message: 'Loket berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}