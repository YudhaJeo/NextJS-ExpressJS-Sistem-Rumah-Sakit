// src/controllers/tindakanInapController.js
import * as TindakanInap from '../models/tindakanInapModel.js';
import dayjs from 'dayjs';

export async function getAllTindakanInap(req, res) {
  try {
    const data = await TindakanInap.getAll();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getTindakanInapByRawatInapId(req, res) {
  try {
    const { idRawatInap } = req.params;
    const data = await TindakanInap.getByRawatInapId(idRawatInap);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function insertTindakanInap(req, res) {
  try {
    const { 
      IDRAWATINAP, 
      IDTINDAKAN, 
      IDTENAGAMEDIS, 
      WAKTUPEMBERIAN, 
      JUMLAH, 
      HARGA, 
      TOTAL 
    } = req.body;

    if (!IDRAWATINAP || !IDTINDAKAN || !IDTENAGAMEDIS || !WAKTUPEMBERIAN || !JUMLAH || !HARGA || !TOTAL) {
      return res.status(400).json({ status: 'error', message: 'Semua field wajib diisi' });
    }

    const formattedWaktu = dayjs(WAKTUPEMBERIAN).format('YYYY-MM-DD HH:mm:ss');

    const result = await TindakanInap.create({
      IDRAWATINAP,
      IDTINDAKAN,
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
    console.error("Insert Tindakan Inap Error:", err);
    res.status(500).json({ status: 'error', message: err.message });
  }
}

export async function deleteTindakanInap(req, res) {
  try {
    const id = req.params.id;

    const result = await TindakanInap.remove(id);

    if (result.status === 'error') {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
}