import * as RiwayatRawatJalan from '../models/riwayatJalanModel.js';

export async function getAllRiwayatJalan(req, res) {
  try {
    const data = await RiwayatRawatJalan.getAllRiwayatJalan();
    res.status(200).json({ data });
  } catch (error) {
    console.error('[GET] /riwayat_jalan gagal:', error);
    res.status(500).json({
      message: 'Gagal mengambil data riwayat rawat jalan',
    });
  }
}

export async function getRiwayatJalanById(req, res) {
  const { id } = req.params;

  if (isNaN(parseInt(id))) {
    return res.status(400).json({ message: 'ID tidak valid' });
  }

  try {
    const dataUtama = await RiwayatRawatJalan.getRiwayatJalanById(id);
    if (!dataUtama) {
      return res.status(404).json({ message: 'Riwayat rawat jalan tidak ditemukan' });
    }

    const daftarTindakan = await RiwayatRawatJalan.getRiwayatTindakanByIdRiwayat(id);

    const responseData = {
      ...dataUtama,
      tindakan: daftarTindakan,
    };

    return res.status(200).json({ data: responseData });
  } catch (err) {
    console.error(`[GET] /riwayat_jalan/${id} gagal:`, err);
    return res.status(500).json({ message: 'Gagal mengambil detail riwayat rawat jalan' });
  }
}