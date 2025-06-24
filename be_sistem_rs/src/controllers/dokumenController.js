import DokumenModel from '../models/dokumenModel.js';
import path from 'path';
import fs from 'fs';

export const getAllDokumen = async (req, res) => {
  try {
    const dokumen = await DokumenModel.getAll();
    res.json(dokumen);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDokumenByNIK = async (req, res) => {
  try {
    const { nik } = req.params;
    const dokumen = await DokumenModel.getByNIK(nik);
    res.json(dokumen);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDokumenById = async (req, res) => {
  try {
    const { id } = req.params;
    const dokumen = await DokumenModel.getById(id);
    if (!dokumen) return res.status(404).json({ message: 'Dokumen tidak ditemukan' });
    res.json(dokumen);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createDokumen = async (req, res) => {
  try {
    const { NIK, JENISDOKUMEN } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: 'File harus diunggah' });

    const newDokumen = {
      NIK,
      JENISDOKUMEN,
      NAMAFILE: file.originalname,
      LOKASIFILE: file.path,
    };

    await DokumenModel.create(newDokumen);
    res.status(201).json({ message: 'Dokumen berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteDokumen = async (req, res) => {
  try {
    const { id } = req.params;
    const dokumen = await DokumenModel.getById(id);
    if (!dokumen) return res.status(404).json({ message: 'Dokumen tidak ditemukan' });

    // Hapus file fisik
    if (dokumen.LOKASIFILE && fs.existsSync(dokumen.LOKASIFILE)) {
      fs.unlinkSync(dokumen.LOKASIFILE);
    }

    await DokumenModel.remove(id);
    res.json({ message: 'Dokumen berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
