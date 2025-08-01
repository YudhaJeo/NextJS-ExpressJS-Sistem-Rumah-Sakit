import * as DashboardModel from '../models/dashboardDokterModel.js';

export const getDashboardDokter = async (req, res) => {
  try {
    const totalDokter = await DashboardModel.getTotalDokter();
    const totalPoli = await DashboardModel.getTotalPoli();
    const jadwalHariIni = await DashboardModel.getJadwalHariIni();
    const laporanHariIni = await DashboardModel.getLaporanHariIni();
    // const bulanan = await DashboardModel.getStatistikBulanan();

    res.status(200).json({
      totalDokter: totalDokter?.total || 0,
      totalPoli: totalPoli?.total || 0,
      jadwalHariIni: jadwalHariIni?.total || 0,
      laporanHariIni: laporanHariIni?.total || 0,
      // bulanan: bulanan || []
    });
  } catch (error) {
    console.error('Gagal ambil data dashboard dokter:', error);
    res.status(500).json({ message: 'Gagal mengambil data dashboard dokter' });
  }
};
