// sistem_rs_be\src\controllers\riwayatInapController.js
import * as RiwayatRawatInap from '../models/riwayatInapModel.js';

export async function getAllRiwayatInap(req, res) {
  try {
    const data = await RiwayatRawatInap.getAllRiwayatInap();
    res.status(200).json({ data });
  } catch (error) {
    console.error('[GET] /riwayat_inap gagal:', error);
    res.status(500).json({
      message: 'Gagal mengambil data riwayat rawat inap',
    });
  }
}

export async function getRiwayatInapById(req, res) {
  const { id } = req.params;

  if (isNaN(parseInt(id))) {
    return res.status(400).json({ message: 'ID tidak valid' });
  }

  try {
    const dataUtama = await RiwayatRawatInap.getRiwayatInapById(id);
    if (!dataUtama) {
      return res.status(404).json({ message: 'Riwayat rawat inap tidak ditemukan' });
    }

    const daftarObat = await RiwayatRawatInap.getRiwayatObatByIdRiwayat(id);
    const daftarTindakan = await RiwayatRawatInap.getRiwayatTindakanByIdRiwayat(id);

    const responseData = {
      data: {
        ...dataUtama,
        obat: daftarObat,
        tindakan: daftarTindakan,
      }
    };

    // console.log(`[GET] /riwayat_inap/${id} response:\n`, JSON.stringify(responseData, null, 2));
    return res.status(200).json(responseData); 
  } catch (err) {
    console.error(`[GET] /riwayat_inap/${id} gagal:`, err);
    return res.status(500).json({ message: 'Gagal mengambil detail riwayat rawat inap' });
  }
}
