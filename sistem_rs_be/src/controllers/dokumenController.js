import * as DokumenModel from '../models/dokumenModel.js';
import { uploadToMinio } from "../utils/uploadMinio.js";
import { deleteFromMinio } from "../utils/deleteMinio.js";
import minioClient from "../core/config/minio.js";

export const getAllDokumen = async (req, res) => {
  try {
    const dokumen = await DokumenModel.getAll();
    res.json({ data: dokumen });
  } catch (err) {
    console.error("getAllDokumen Error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const createDokumen = async (req, res) => {
  try {
    const { NIK, JENISDOKUMEN } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "File harus diupload" });
    }

    const LOKASIFILE = await uploadToMinio(file, "dokumen");
    const TANGGALUPLOAD = new Date();

    const newDokumen = {
      NIK,
      JENISDOKUMEN,
      NAMAFILE: file.originalname,
      LOKASIFILE, 
      TANGGALUPLOAD,
    };

    const inserted = await DokumenModel.create(newDokumen);
    res.status(201).json({ message: "Dokumen berhasil disimpan", data: inserted });
  } catch (err) {
    console.error("createDokumen Error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const updateDokumen = async (req, res) => {
  try {
    const { id } = req.params;
    const { NIK, JENISDOKUMEN } = req.body;

    const dokumenLama = await DokumenModel.getById(id);
    if (!dokumenLama) {
      return res.status(404).json({ error: "Dokumen tidak ditemukan" });
    }

    let LOKASIFILE = dokumenLama.LOKASIFILE;
    let NAMAFILE = dokumenLama.NAMAFILE;

    if (req.file) {

      if (dokumenLama.LOKASIFILE) {
        await deleteFromMinio(dokumenLama.LOKASIFILE);
      }
      LOKASIFILE = await uploadToMinio(req.file, "dokumen");
      NAMAFILE = req.file.originalname;
    }

    const updatedData = {
      NIK,
      JENISDOKUMEN,
      NAMAFILE,
      LOKASIFILE,
      TANGGALUPLOAD: new Date(),
    };

    const updated = await DokumenModel.update(id, updatedData);
    res.json({ message: "Dokumen berhasil diperbarui", data: updated });
  } catch (err) {
    console.error("updateDokumen Error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteDokumen = async (req, res) => {
  try {
    const { id } = req.params;
    const dokumen = await DokumenModel.getById(id);

    if (!dokumen) {
      return res.status(404).json({ error: "Dokumen tidak ditemukan" });
    }

    if (dokumen.LOKASIFILE) {
      await deleteFromMinio(dokumen.LOKASIFILE);
    }

    await DokumenModel.remove(id);
    res.json({ message: "Dokumen berhasil dihapus" });
  } catch (err) {
    console.error("deleteDokumen Error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const downloadDokumen = async (req, res) => {
  try {
    const { filename } = req.params;
    const objectName = `dokumen/${filename}`;

    const fileStream = await minioClient.getObject("uploads", objectName);
    res.attachment(filename);
    fileStream.pipe(res);
  } catch (err) {
    console.error("downloadDokumen Error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const downloadById = async (req, res) => {
  try {
    const { id } = req.params;
    const dokumen = await DokumenModel.getById(id);

    if (!dokumen || !dokumen.LOKASIFILE) {
      return res.status(404).json({ error: "Dokumen tidak ditemukan" });
    }

    const objectName = dokumen.LOKASIFILE.replace(/^\/?uploads\//, "");

    const fileStream = await minioClient.getObject("uploads", objectName);

    res.attachment(dokumen.NAMAFILE);
    fileStream.pipe(res);
  } catch (err) {
    console.error("downloadById Error:", err);
    res.status(500).json({ error: err.message });
  }
};