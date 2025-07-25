import * as PengobatanModel from '../models/riwayatpengobatanModel.js';
import * as PendaftaranModel from '../models/pendaftaranModel.js';

export async function getAllPengobatan(req, res) {
  try {
    const data = await PengobatanModel.getAllPengobatan();
    res.json({ data });
  } catch (err) {
    console.error('🔥 ERROR GET /riwayat_pengobatan:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function createPengobatan(req, res) {
  try {
    const { IDPENDAFTARAN, IDDOKTER, STATUSKUNJUNGAN, STATUSRAWAT, DIAGNOSA, OBAT } = req.body;
    await PengobatanModel.createPengobatan({
      IDPENDAFTARAN,
      IDDOKTER,
      STATUSKUNJUNGAN,
      STATUSRAWAT,
      DIAGNOSA,
      OBAT
    });
    res.json({ message: 'Pengobatan berhasil ditambahkan' });
  } catch (err) {
    console.error('Insert Error:', err); 
    res.status(500).json({ error: err.message });
  }
}

export async function updatePengobatan(req, res) {
  try {
    const id = req.params.id;
    const { IDDOKTER, STATUSKUNJUNGAN, STATUSRAWAT, DIAGNOSA, OBAT } = req.body;

    await PengobatanModel.updatePengobatan(id, {
      IDDOKTER,
      STATUSKUNJUNGAN,
      STATUSRAWAT,
      DIAGNOSA,
      OBAT
    });

    const IDPENDAFTARAN = await PengobatanModel.getPendaftaranIdByPengobatanId(id);

    if (STATUSKUNJUNGAN && IDPENDAFTARAN) {
      const result = await PendaftaranModel.update(IDPENDAFTARAN, { STATUSKUNJUNGAN });
    }

    res.json({ message: 'Pengobatan dan status pendaftaran berhasil diperbarui' });
  } catch (err) {
    console.error('Update Error:', err);
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

export const getMonitoringPengobatan = async (req, res) => {
  try {
    const data = await PengobatanModel.getAllPengobatan(); 
    res.json(data);
  } catch (error) {
    console.error('Error getMonitoringPengobatan:', error);
    res.status(500).json({ message: 'Gagal mengambil data monitoring pengobatan' });
  }
}