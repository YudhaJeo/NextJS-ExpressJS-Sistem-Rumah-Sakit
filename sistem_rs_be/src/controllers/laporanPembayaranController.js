import * as LaporanPembayaranModel from "../models/laporanPembayaranModel.js";

export async function getLaporanPembayaran(req, res) {
  try {
    const { startDate, endDate, nik, metode } = req.query;

    const rows = await LaporanPembayaranModel.getAll({
      startDate,
      endDate,
      nik,
      metode,
    });

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (err) {
    console.error("Error laporan pembayaran:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}
