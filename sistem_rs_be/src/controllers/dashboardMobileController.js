import * as DashboardModel from '../models/dashboardMobileModel.js';

export const getDashboardInformasi = async (req, res) => {
  try {
    const totalBerita = await DashboardModel.getTotalBerita();
    const totalKritikSaran = await DashboardModel.getTotalKritikSaran();
    const totalNotifikasi = await DashboardModel.getTotalNotifikasi();
    const totalProfile = await DashboardModel.getTotalProfile();
    const recent = await DashboardModel.getRecentData();

    res.status(200).json({
      totalBerita: totalBerita?.total || 0,
      totalKritik: totalKritikSaran?.total || 0,
      totalNotifikasi: totalNotifikasi?.total || 0,
      totalProfile: totalProfile?.total || 0,
      recent,
    });
  } catch (error) {
    console.error('Gagal ambil data dashboard informasi:', error);
    res.status(500).json({ message: 'Gagal mengambil data dashboard informasi' });
  }
};
