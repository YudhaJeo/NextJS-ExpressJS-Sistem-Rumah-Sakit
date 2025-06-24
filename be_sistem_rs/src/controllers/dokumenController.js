import DokumenModel from '../models/dokumenModel.js';
import fs from 'fs';
import path from 'path';

// Pastikan folder upload tersedia
const uploadDir = path.join('uploads/dokumen');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const getAllDokumen = async (req, res) => {
  try {
    const dokumen = await DokumenModel.getAll();
    console.log('Data Dokumen:', dokumen); // Debug log
    res.json({ data: dokumen });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createDokumen = async (req, res) => {
  try {
    const { NIK, JENISDOKUMEN } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'File harus diupload' });
    }

    const NAMAFILE = file.originalname;
    const LOKASIFILE = file.path;
    const TANGGALUPLOAD = new Date();

    const newDokumen = {
      NIK,
      NAMAFILE,
      JENISDOKUMEN,
      LOKASIFILE,
      TANGGALUPLOAD,
    };

    const inserted = await DokumenModel.create(newDokumen);
    res.status(201).json({ message: 'Dokumen berhasil disimpan', data: inserted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};