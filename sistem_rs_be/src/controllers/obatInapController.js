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
      return res.status(400).json({ status: 'error', message: 'Semua field wajib diisi' });
    }

    const formattedWaktu = dayjs(WAKTUPEMBERIAN).format('YYYY-MM-DD HH:mm:ss');

    const result = await ObatInap.create({
      IDRAWATINAP,
      IDOBAT,
      IDTENAGAMEDIS,
      WAKTUPEMBERIAN: formattedWaktu, 
      JUMLAH,
      HARGA,
      TOTAL,
    });

    if (result.status === 'error') {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (err) {
    console.error("Insert Obat Inap Error:", err);
    res.status(500).json({ status: 'error', message: err.message });
  }
}

export async function deleteObatInap(req, res) {
  try {
    const id = req.params.id;

    const result = await ObatInap.remove(id);

    if (result.status === 'error') {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
}