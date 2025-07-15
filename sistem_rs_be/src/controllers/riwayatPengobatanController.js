import * as PengobatanModel from '../models/riwayatpengobatanModel.js';

export async function getAllPengobatan(req, res) {
  try {
    const data = await PengobatanModel.getAllPengobatan();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createPengobatan(req, res) {
  try {
    const { IDPENDAFTARAN, STATUSKUNJUNGAN, STATUSRAWAT, DIAGNOSA, OBAT } = req.body;
    console.log('Terima data:', req.body); // debug
    await PengobatanModel.createPengobatan({
      IDPENDAFTARAN,
      STATUSKUNJUNGAN,
      STATUSRAWAT,
      DIAGNOSA,
      OBAT
    });
    res.json({ message: 'Pengobatan berhasil ditambahkan' });
  } catch (err) {
    console.error('Insert Error:', err); // pastikan ini ada
    res.status(500).json({ error: err.message });
  }
}

export async function updatePengobatan(req, res) {
  try {
    const id = req.params.id;
    const { STATUSKUNJUNGAN, STATUSRAWAT, DIAGNOSA, OBAT } = req.body;
    await PengobatanModel.updatePengobatan(id, {
      STATUSKUNJUNGAN,
      STATUSRAWAT,
      DIAGNOSA,
      OBAT
    });
    res.json({ message: 'Pengobatan berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deletePengobatan(req, res) {
  try {
    const id = req.params.id;
    await PengobatanModel.deletePengobatan(id);
    res.json({ message: 'Pengobatan berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
