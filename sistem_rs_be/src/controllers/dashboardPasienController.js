import * as DashboardModel from '../models/dashboardPasienModel.js';

export const getStatistikPasien = async (req, res) => {
  try {
    const totalPasien = await DashboardModel.getTotalPasien();
    const pasienHariIni = await DashboardModel.getPasienHariIni();
    const jenisKelamin = await DashboardModel.getJumlahPerJenisKelamin();
    const bulanan = await DashboardModel.getStatistikBulanan();

    const jumlahLaki = jenisKelamin.find((j) => j.JENISKELAMIN === 'L')?.total || 0;
    const jumlahPerempuan = jenisKelamin.find((j) => j.JENISKELAMIN === 'P')?.total || 0;

    res.status(200).json({
      totalPasien: totalPasien?.total || 0,
      pasienHariIni: pasienHariIni?.total || 0,
      jumlahLaki,
      jumlahPerempuan,
      bulanan: bulanan.reverse(), 
    });
  } catch (error) {
    console.error('Gagal ambil statistik pasien:', error);
    res.status(500).json({ message: 'Gagal mengambil data statistik pasien' });
  }
};
