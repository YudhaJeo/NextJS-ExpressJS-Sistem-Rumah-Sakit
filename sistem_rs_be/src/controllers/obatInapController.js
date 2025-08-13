// src/controllers/obatInapController.js
import * as ObatInap from '../models/obatInapModel.js';
import dayjs from 'dayjs';

export async function getAllObatInap(req, res) {
  try {
    const data = await ObatInap.getAll();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getObatInapByRawatInapId(req, res) {
  try {
    const { idRawatInap } = req.params;
    const data = await ObatInap.getByRawatInapId(idRawatInap);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function insertObatInap(req, res) {
  try {
    const { 
      IDRAWATINAP, 
      IDOBAT, 
      IDTENAGAMEDIS, 
      WAKTUPEMBERIAN, 
      JUMLAH, 
      HARGA, 
      TOTAL 
    } = req.body;

    if (!IDRAWATINAP || !IDOBAT || !IDTENAGAMEDIS || !WAKTUPEMBERIAN || !JUMLAH || !HARGA || !TOTAL) {
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

    const formattedWaktu = dayjs(WAKTUPEMBERIAN).format('YYYY-MM-DD HH:mm:ss');

    await ObatInap.create({
      IDRAWATINAP,
      IDOBAT,
      IDTENAGAMEDIS,
      WAKTUPEMBERIAN: formattedWaktu, 
      JUMLAH,
      HARGA,
      TOTAL,
    });

    res.json({ message: 'Data obat inap berhasil ditambahkan' });
  } catch (err) {
    console.error("Insert Obat Inap Error:", err);
    res.status(500).json({ error: err.message });
  }
}

export async function deleteObatInap(req, res) {
  try {
    const id = req.params.id;

    const existing = await ObatInap.getById(id);
    if (!existing) return res.status(404).json({ error: 'Data tidak ditemukan' });

    await ObatInap.remove(id);
    res.json({ message: 'Data berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
