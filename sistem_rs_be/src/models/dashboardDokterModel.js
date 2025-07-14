import db from '../core/config/knex.js';

export const getTotalDokter = async () => {
  try {
    return await db('dokter').count('IDDOKTER as total').first();
  } catch (error) {
    console.error('Error getTotalDokter:', error);
    throw error;
  }
};

export const getTotalPoli = async () => {
  try {
    return await db('poli').count('IDPOLI as total').first();
  } catch (error) {
    console.error('Error getTotalPoli:', error);
    throw error;
  }
};

export const getJadwalHariIni = async () => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const hariSekarang = new Date().toLocaleDateString('id-ID', { weekday: 'long' });
    const hariUpper = hariSekarang.charAt(0).toUpperCase() + hariSekarang.slice(1); // Kapitalisasi awal huruf

    return await db('jadwal_dokter')
    .where('HARI', hariUpper)
    .count('IDJADWAL as total');

  } catch (error) {
    console.error('Error getJadwalHariIni:', error);
    throw error;
  }
};

// export const getLaporanHariIni = async () => {
//   try {
//     const today = new Date().toISOString().slice(0, 10);
//     return await db('laporan_dokter')
//       .where('TANGGAL', today)
//       .count('IDLAPORAN as total')
//       .first();
//   } catch (error) {
//     console.error('Error getLaporanHariIni:', error);
//     throw error;
//   }
// };

// export const getStatistikBulanan = async () => {
//   try {
//     return await db('laporan_dokter')
//       .select(db.raw('MONTH(TANGGAL) as bulan'), db.raw('COUNT(*) as total'))
//       .whereRaw('YEAR(TANGGAL) = YEAR(CURDATE())')
//       .groupByRaw('MONTH(TANGGAL)')
//       .orderBy('bulan', 'asc');
//   } catch (error) {
//     console.error('Error getStatistikBulanan:', error);
//     throw error;
//   }
// };