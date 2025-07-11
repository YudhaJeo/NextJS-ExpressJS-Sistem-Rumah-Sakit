import * as MetodeModel from '../models/metodePembayaranModel.js';

export async function getAllMetode(req, res) {
  try {
    const data = await MetodeModel.getAll();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createMetode(req, res) {
  try {
    const { NAMA, FEE_PERSEN, STATUS, CATATAN } = req.body;
    await MetodeModel.create({ NAMA, FEE_PERSEN, STATUS, CATATAN });
    res.json({ message: 'Metode pembayaran berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateMetode(req, res) {
  try {
    const id = req.params.id;
    const { NAMA, FEE_PERSEN, STATUS, CATATAN } = req.body;
    await MetodeModel.update(id, { NAMA, FEE_PERSEN, STATUS, CATATAN });
    res.json({ message: 'Metode pembayaran berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteMetode(req, res) {
  try {
    const id = req.params.id;
    await MetodeModel.remove(id);
    res.json({ message: 'Metode pembayaran berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}