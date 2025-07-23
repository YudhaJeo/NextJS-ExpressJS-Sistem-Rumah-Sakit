// src/controllers/riwayatRawatInapController.js
import * as RiwayatRawatInap from '../models/riwayatInapModel.js';

export async function getAllRiwayatInap(req, res) {
  try {
    const data = await RiwayatRawatInap.getRiwayatInap();
    res.json({ data });
  } catch (error) {
    console.error('[GET] /riwayat_inap gagal:', error);
    res.status(500).json({
      message: 'Gagal mengambil data riwayat rawat inap',
    });
  }
}

export async function getRiwayatInapById(req, res) {
  const { id } = req.params;
  try {
    const dataUtama = await RiwayatRawatInap.getRiwayatInapById(id);
    const daftarObat = await RiwayatRawatInap.getObatInapByIdRawatInap(id);
    const daftarTindakan = await RiwayatRawatInap.getTindakanInapByIdRawatInap(id);

    const responseData = {
      data: {
        ...dataUtama,
        obat: daftarObat,
        tindakan: daftarTindakan,
      }
    };
    
    res.json(responseData);
  } catch (err) {
    console.error('[GET] /riwayat_inap/:id gagal:', err);
    res.status(500).json({ error: 'Gagal ambil data' });
  }
}

