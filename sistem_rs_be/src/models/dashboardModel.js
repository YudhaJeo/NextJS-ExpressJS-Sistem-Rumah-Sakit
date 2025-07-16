import db from '../core/config/knex.js';

export const getDashboardInfo = async () => {
  const [
    jumlahPasien,
    jumlahDokter,
    bedTersedia,
    bedTerisi
  ] = await Promise.all([
    db('pasien').count('IDPASIEN as total'),
    db('master_tenaga_medis').count('IDTENAGA as total').where('ROLE', 'Dokter'),
    db('bed').where('STATUS', 'Tersedia').count('IDBED as total'),
    db('bed').where('STATUS', 'Terisi').count('IDBED as total')
  ]);

  return {
    jumlahPasien: jumlahPasien[0].total,
    jumlahDokter: jumlahDokter[0].total,
    bedTersedia: bedTersedia[0].total,
    bedTerisi: bedTerisi[0].total,

    statistikHarian: [4800, 3000, 6000, 4300, 2000, 5000, 4000],
    statistikBulanan: {
      labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
      revenue: [10, 20, 35, 60, 90, 95],
      profit: [5, 15, 30, 55, 85, 92]
    }
  };
};