import * as RiwayatKunjunganModel from '../models/riwayatkunjunganModel.js';

export async function getRiwayatKunjungan(req, res) {
  try {
    const data = await RiwayatKunjunganModel.getRiwayatKunjungan();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
