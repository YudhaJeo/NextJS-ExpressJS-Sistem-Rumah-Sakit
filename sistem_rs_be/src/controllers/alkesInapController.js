// src/controllers/alkesInapController.js
import * as AlkesInap from '../models/alkesInapModel.js';
import dayjs from 'dayjs';

export async function getAllAlkesInap(req, res) {
  try {
    const data = await AlkesInap.getAll();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getAlkesInapByRawatInapId(req, res) {
  try {
    const { idRawatInap } = req.params;
    const data = await AlkesInap.getByRawatInapId(idRawatInap);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function insertAlkesInap(req, res) {
  try {
    const { 
      IDRAWATINAP, 
      IDALKES, 
      IDTENAGAMEDIS, 
      WAKTUPEMBERIAN, 
      JUMLAH, 
      HARGA, 
      TOTAL 
    } = req.body;

    if (!IDRAWATINAP || !IDALKES || !IDTENAGAMEDIS || !WAKTUPEMBERIAN || !JUMLAH || !HARGA || !TOTAL) {
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

    const formattedWaktu = dayjs(WAKTUPEMBERIAN).format('YYYY-MM-DD HH:mm:ss');

    await AlkesInap.create({
      IDRAWATINAP,
      IDALKES,
      IDTENAGAMEDIS,
      WAKTUPEMBERIAN: formattedWaktu, 
      JUMLAH,
      HARGA,
      TOTAL,
    });

    res.json({ message: 'Data alkes inap berhasil ditambahkan' });
  } catch (err) {
    console.error("Insert Alkes Inap Error:", err);
    res.status(500).json({ error: err.message });
  }
}

export async function deleteAlkesInap(req, res) {
  try {
    const id = req.params.id;

    const existing = await AlkesInap.getById(id);
    if (!existing) return res.status(404).json({ error: 'Data tidak ditemukan' });

    await AlkesInap.remove(id);
    res.json({ message: 'Data berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
