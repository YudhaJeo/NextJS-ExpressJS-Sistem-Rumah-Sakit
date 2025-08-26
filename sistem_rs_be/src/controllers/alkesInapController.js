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
      return res.status(400).json({ status: 'error', message: 'Semua field wajib diisi' });
    }

    const formattedWaktu = dayjs(WAKTUPEMBERIAN).format('YYYY-MM-DD HH:mm:ss');

    const result = await AlkesInap.create({
      IDRAWATINAP,
      IDALKES,
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
    console.error("Insert Alkes Inap Error:", err);
    res.status(500).json({ status: 'error', message: err.message });
  }
}

export async function deleteAlkesInap(req, res) {
  try {
    const id = req.params.id;

    const result = await AlkesInap.remove(id);

    if (result.status === 'error') {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
}