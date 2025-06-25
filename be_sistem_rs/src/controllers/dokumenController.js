import * as DokumenModel from '../models/dokumenModel.js';
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

export const updateDokumen = async (req, res) => {
  try {
    const { id } = req.params;
    const { NIK, JENISDOKUMEN, NAMAFILE } = req.body;
    const file = req.file;

    // Ambil data lama dari database
    const dokumenLama = await DokumenModel.getById(id);
    if (!dokumenLama) {
      return res.status(404).json({ error: 'Dokumen tidak ditemukan' });
    }

    let updatedData = {
      NIK,
      JENISDOKUMEN,
      NAMAFILE: NAMAFILE || dokumenLama.NAMAFILE,
      LOKASIFILE: dokumenLama.LOKASIFILE,
      TANGGALUPLOAD: new Date(),
    };

    if (file) {
      // Hapus file lama (optional, jika ingin bersih)
      if (dokumenLama.LOKASIFILE && fs.existsSync(dokumenLama.LOKASIFILE)) {
        fs.unlinkSync(dokumenLama.LOKASIFILE);
      }

      // Ganti data file
      updatedData.LOKASIFILE = file.path;
      updatedData.NAMAFILE = file.originalname;
    }

    const updated = await DokumenModel.update(id, updatedData);
    res.json({ message: 'Dokumen berhasil diperbarui', data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteDokumen = async (req, res) => {
  try {
    const { id } = req.params;
    const dokumen = await DokumenModel.getById(id);
    if (!dokumen) {
      return res.status(404).json({ error: 'Dokumen tidak ditemukan' });
    }

    // Hapus file dari sistem (jika ada)
    if (dokumen.LOKASIFILE && fs.existsSync(dokumen.LOKASIFILE)) {
      fs.unlinkSync(dokumen.LOKASIFILE);
    }

    await DokumenModel.remove(id);
    res.json({ message: 'Dokumen berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const downloadDokumen = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(uploadDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File tidak ditemukan' });
    }

    res.download(filePath, filename); // ← Ini yang penting agar browser langsung download
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};