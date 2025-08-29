import * as Model from '../models/riwayatKunjunganModel.js';

export async function getRiwayatKunjungan(req, res) {
  try {
    const data = await Model.getRiwayatKunjungan();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getDetailRiwayat(req, res) {
  try {
    const { nik } = req.params;
    const data = await Model.getRiwayatByPasien(nik);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}