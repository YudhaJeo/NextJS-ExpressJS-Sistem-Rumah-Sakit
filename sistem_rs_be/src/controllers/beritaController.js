// src/controllers/beritaController.js
import * as BeritaModel from "../models/beritaModel.js";
import { uploadToMinio } from "../utils/uploadMinio.js";
import { deleteFromMinio } from "../utils/deleteMinio.js";
import minioClient from "../core/config/minio.js";

export const getAllBerita = async (req, res) => {
  try {
    const berita = await BeritaModel.getAll();
    res.json({ data: berita });
  } catch (err) {
    console.error("getAllBerita Error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const createBerita = async (req, res) => {
  try {
    const { JUDUL, DESKRIPSISINGKAT, URL } = req.body;
    const file = req.file;

    if (!JUDUL || !DESKRIPSISINGKAT) {
      return res.status(400).json({ error: "Judul dan deskripsi singkat wajib diisi" });
    }

    if (!file) {
      return res.status(400).json({ error: "File harus diupload" });
    }

    // Upload file ke folder "berita" di bucket "uploads"
    const filePath = await uploadToMinio(file, "berita");

    const newBerita = {
      JUDUL,
      DESKRIPSISINGKAT,
      PRATINJAU: filePath,
      URL: URL || null,
    };

    const [insertedId] = await BeritaModel.create(newBerita);

    res.status(201).json({
      message: "Berita berhasil disimpan",
      data: { id: insertedId, ...newBerita },
    });
  } catch (err) {
    console.error("createBerita Error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const updateBerita = async (req, res) => {
  try {
    const { id } = req.params;
    const { JUDUL, DESKRIPSISINGKAT, URL } = req.body;
    const file = req.file;

    const beritaLama = await BeritaModel.getById(id);
    if (!beritaLama) {
      return res.status(404).json({ error: "Berita tidak ditemukan" });
    }

    let PRATINJAU = beritaLama.PRATINJAU;

    if (file) {
      try {
        await deleteFromMinio(beritaLama.PRATINJAU);
      } catch (e) {
        console.warn("⚠️ Gagal hapus file lama:", e.message);
      }

      const newPath = await uploadToMinio(file, "berita");
      PRATINJAU = newPath;
    }

    const updatedData = {
      JUDUL: JUDUL || beritaLama.JUDUL,
      DESKRIPSISINGKAT: DESKRIPSISINGKAT || beritaLama.DESKRIPSISINGKAT,
      PRATINJAU,
      URL: URL || beritaLama.URL,
      UPDATED_AT: new Date(),
    };

    await BeritaModel.update(id, updatedData);

    res.json({
      message: "Berita berhasil diperbarui",
      data: updatedData,
    });
  } catch (err) {
    console.error("updateBerita Error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteBerita = async (req, res) => {
  try {
    const { id } = req.params;
    const berita = await BeritaModel.getById(id);

    if (!berita) {
      return res.status(404).json({ error: "Berita tidak ditemukan" });
    }

    try {
      await deleteFromMinio(berita.PRATINJAU);
    } catch (e) {
      console.warn("⚠️ Gagal hapus file dari MinIO:", e.message);
    }

    await BeritaModel.remove(id);
    res.json({ message: "Berita berhasil dihapus" });
  } catch (err) {
    console.error("deleteBerita Error:", err);
    res.status(500).json({ error: err.message });
  }
};