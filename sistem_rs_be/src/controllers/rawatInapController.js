// src\controllers\rawatInapController.js
import * as RawatInap from '../models/rawatInapModel.js';
import * as Bed from '../models/bedModel.js';

export async function getAllRawatInap(req, res) {
  try {
    const data = await RawatInap.getAll();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function insertRawatInap(req, res) {
  try {
    const { IDPASIEN, IDBED, TANGGALMASUK, TANGGALKELUAR, STATUS, CATATAN } = req.body;

    await RawatInap.create({ IDPASIEN, IDBED, TANGGALMASUK, TANGGALKELUAR, STATUS, CATATAN });
    await RawatInap.updateBedStatus(IDBED, 'TERISI');

    res.json({ message: 'Rawat inap berhasil ditambahkan' });
  } catch (err) {
    console.error('Kirim data gagal:', err)
    res.status(500).json({ error: err.message });
  }
}

export async function updateRawatInap(req, res) {
  try {
    const id = req.params.id;
    const data = req.body;

    const existing = await RawatInap.getById(id);
    if (!existing) return res.status(404).json({ error: 'Data tidak ditemukan' });

    await RawatInap.update(id, {
      ...data,
      TANGGALKELUAR: data.TANGGALKELUAR || null,
    });    

    const statusBed = data.TANGGALKELUAR ? 'TERSEDIA' : 'TERISI';
    await RawatInap.updateBedStatus(data.IDBED, statusBed);

    res.json({ message: 'Rawat inap berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteRawatInap(req, res) {
  try {
    const id = req.params.id;

    const existing = await RawatInap.getById(id);
    if (!existing) return res.status(404).json({ error: 'Data tidak ditemukan' });

    await RawatInap.remove(id);
    await RawatInap.updateBedStatus(existing.IDBED, 'TERSEDIA');
    res.json({ message: 'Data berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
