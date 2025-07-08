import * as PendaftaranModel from '../models/pendaftaranModel.js';

export async function getAllPendaftaran(req, res) {
  try {
    const data = await PendaftaranModel.getAll();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createPendaftaran(req, res) {
  try {
    const { NIK, TANGGALKUNJUNGAN, IDPOLI, KELUHAN, STATUSKUNJUNGAN } = req.body;
    await PendaftaranModel.create({ NIK, TANGGALKUNJUNGAN, IDPOLI, KELUHAN, STATUSKUNJUNGAN });
    res.json({ message: 'Pendaftaran berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


export async function updatePendaftaran(req, res) {
  try {
    const id = req.params.id;
    const { NIK, TANGGALKUNJUNGAN, IDPOLI, KELUHAN, STATUSKUNJUNGAN } = req.body;

    console.log('Update ID:', id);
    console.log('Update Data:', req.body); 

    const result = await PendaftaranModel.update(id, { NIK, TANGGALKUNJUNGAN, IDPOLI, KELUHAN, STATUSKUNJUNGAN });

    res.json({ message: 'Pendaftaran berhasil diperbarui' });
  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ error: err.message });
  }
}


export async function deletePendaftaran(req, res) {
  try {
    const id = req.params.id;
    await PendaftaranModel.remove(id);
    res.json({ message: 'Pendaftaran berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}