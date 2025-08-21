import db from '../core/config/knex.js';

export const getTotalReservasi = async () => {
  try {
    return await db('reservasi_rajal').count('IDRESERVASI as total').first();
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
    return await db('reservasi_rajal').count('IDRESERVASI as total').first();
  } catch (error) {
    console.error('Error getLaporanHariIni:', error);
    throw error;
  }
};

export const getKalenderDokter = async () => {
  try {
    return await db('reservasi_rajal')
      .join('pasien', 'reservasi_rajal.NIK', 'pasien.NIK')
      .join('dokter', 'reservasi_rajal.IDDOKTER', 'dokter.IDDOKTER')
      .leftJoin('master_tenaga_medis', 'dokter.IDTENAGAMEDIS', 'master_tenaga_medis.IDTENAGAMEDIS')
      .select(
        'pasien.NAMALENGKAP as nama_pasien',
        'master_tenaga_medis.NAMALENGKAP as nama_dokter',
        'reservasi_rajal.TANGGALRESERVASI as tanggal',
        'reservasi_rajal.KETERANGAN as keterangan',
        'reservasi_rajal.STATUS as status'
      )
      .where('reservasi_rajal.STATUS', 'dikonfirmasi')
      .orderBy('reservasi_rajal.TANGGALRESERVASI', 'asc');
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