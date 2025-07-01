// src/controllers/pasienController.js
import * as PasienModel from '../models/pasienModel.js';

export async function getAllPasien(req, res) {
  try {
    const pasien = await PasienModel.getAll();
    res.json({ data: pasien });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createPasien(req, res) {
  try {
    const { 
      NIK,
      NAMALENGKAP,
      TANGGALLAHIR,
      JENISKELAMIN,
      ALAMAT,
      NOHP,
      IDAGAMA,
      GOLDARAH,
      IDASURANSI,
      NOASURANSI
    } = req.body;

    await PasienModel.create({
      NIK,
      NAMALENGKAP,
      TANGGALLAHIR,
      JENISKELAMIN,
      ALAMAT,
      NOHP,
      IDAGAMA,
      GOLDARAH,
      IDASURANSI,
      NOASURANSI
    });

    res.json({ message: 'Pasien berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(req.body)
    console.log(err)
  }
}

export async function updatePasien(req, res) {
  try {
    const id = req.params.id;

    const existing = await PasienModel.getById(id);
    if (!existing) return res.status(404).json({ error: 'Pasien tidak ditemukan' });

    const {
      NIK,
      NAMALENGKAP,
      TANGGALLAHIR,
      JENISKELAMIN,
      ALAMAT,
      NOHP,
      IDAGAMA,
      GOLDARAH,
      IDASURANSI,
      NOASURANSI
    } = req.body;

    await PasienModel.update(id, {
      NIK,
      NAMALENGKAP,
      TANGGALLAHIR,
      JENISKELAMIN,
      ALAMAT,
      NOHP,
      IDAGAMA,
      GOLDARAH,
      IDASURANSI,
      NOASURANSI
    });

    res.json({ message: 'Pasien berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deletePasien(req, res) {
  try {
    const id = req.params.id;
    await PasienModel.remove(id);
    res.json({ message: 'Pasien berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
