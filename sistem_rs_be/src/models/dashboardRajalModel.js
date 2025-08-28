import db from '../core/config/knex.js';

export const getTotalReservasi = async () => {
  try {
    return await db('reservasi').count('IDRESERVASI as total').first();
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
    return await db('pasien').count('IDPASIEN as total').first();
  } catch (error) {
    console.error('Error getJadwalHariIni:', error);
    throw error;
  }
};

export const getLaporanHariIni = async () => {
  try {
    return await db('reservasi').count('IDRESERVASI as total').first();
  } catch (error) {
    console.error('Error getLaporanHariIni:', error);
    throw error;
  }
};

export const getKalenderDokter = async () => {
  try {
    return await db('reservasi')
      .join('pasien', 'reservasi.NIK', 'pasien.NIK')
      .join('dokter', 'reservasi.IDDOKTER', 'dokter.IDDOKTER')
      .leftJoin('master_tenaga_medis', 'dokter.IDTENAGAMEDIS', 'master_tenaga_medis.IDTENAGAMEDIS')
      .select(
        'pasien.NAMALENGKAP as nama_pasien',
        'master_tenaga_medis.NAMALENGKAP as nama_dokter',
        'reservasi.TANGGALRESERVASI as tanggal',
        'reservasi.KETERANGAN as keterangan',
        'reservasi.STATUS as status'
      )
      .where('reservasi.STATUS', 'dikonfirmasi')
      .orderBy('reservasi.TANGGALRESERVASI', 'asc');
  } catch (error) {
    console.error('Error getKalenderDokter:', error);
    throw error;
  }
};



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