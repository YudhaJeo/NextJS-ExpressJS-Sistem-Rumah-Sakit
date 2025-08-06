import * as RawatJalanModel from '../models/rawatJalanModel.js';

export async function getAllRawatJalan(req, res) {
  try {
    const poli = req.query.poli;
    let data = await RawatJalanModel.getAllRawatJalan();

    if (poli) {
      data = data.filter((item) => item.POLI === poli);
    }

    res.json({ data });
  } catch (err) {
    console.error('🔥 ERROR GET /rawat_jalan:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function createRawatJalan(req, res) {
  try {
    const { IDPENDAFTARAN, IDDOKTER, STATUSKUNJUNGAN, STATUSRAWAT, DIAGNOSA, OBAT } = req.body;
    await RawatJalanModel.createRawatJalan({
      IDPENDAFTARAN,
      IDDOKTER,
      STATUSKUNJUNGAN,
      STATUSRAWAT,
      DIAGNOSA,
      OBAT
    });
    res.json({ message: 'RawatJalan berhasil ditambahkan' });
  } catch (err) {
    console.error('Insert Error:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function updateRawatJalan(req, res) {
  try {
    const id = req.params.id;
    const { IDDOKTER, STATUSKUNJUNGAN, STATUSRAWAT, DIAGNOSA, OBAT } = req.body;

    await RawatJalanModel.updateRawatJalan(id, {
      IDDOKTER,
      STATUSKUNJUNGAN,
      STATUSRAWAT,
      DIAGNOSA,
      OBAT
    });

    res.json({ message: 'RawatJalan dan status pendaftaran berhasil diperbarui' });
  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function deleteRawatJalan(req, res) {
  try {
    const id = req.params.id;
    await RawatJalanModel.deleteRawatJalan(id);
    res.json({ message: 'RawatJalan berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const getMonitoringRawatJalan = async (req, res) => {
  try {
    const data = await RawatJalanModel.getAllRawatJalan();
    res.json(data);
  } catch (error) {
    console.error('Error getMonitoringRawatJalan:', error);
    res.status(500).json({ message: 'Gagal mengambil data rawat jalan' });
  }
}