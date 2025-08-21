import * as DashboardModel from '../models/dashboardRajalModel.js';

export const getDashboardRajal = async (req, res) => {
  try {
    const totalReservasi = await DashboardModel.getTotalReservasi();
    const totalPoli = await DashboardModel.getTotalPoli();
    const jadwalHariIni = await DashboardModel.getJadwalHariIni();
    const laporanHariIni = await DashboardModel.getLaporanHariIni();
    const kalender = await DashboardModel.getKalenderDokter();

    res.status(200).json({
      totalReservasi: totalReservasi?.total || 0,
      totalPoli: totalPoli?.total || 0,
      jadwalHariIni: jadwalHariIni?.total || 0,
      laporanHariIni: laporanHariIni?.total || 0,
      kalender
    });
  } catch (error) {
    console.error('Gagal ambil data dashboard dokter:', error);
    res.status(500).json({ message: 'Gagal mengambil data dashboard dokter' });
  }
};
