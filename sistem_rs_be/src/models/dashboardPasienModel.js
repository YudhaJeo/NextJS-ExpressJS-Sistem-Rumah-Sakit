import db from '../core/config/knex.js';

export const getTotalPasien = () =>
  db('pasien').count('IDPASIEN as total').first();

export const getPasienHariIni = () => {
  const today = new Date().toISOString().split('T')[0];
  return db('pendaftaran')
    .where('TANGGALKUNJUNGAN', today)
    .count('IDPENDAFTARAN as total')
    .first();
};

export const getJumlahPerJenisKelamin = () =>
  db('pasien')
    .select('JENISKELAMIN')
    .count('IDPASIEN as total')
    .groupBy('JENISKELAMIN');

export const getStatistikBulanan = () =>
  db('pasien')
    .select(
      db.raw("DATE_FORMAT(TANGGALDAFTAR, '%Y-%m') as bulan"),
      db.raw('COUNT(*) as total')
    )
    .groupByRaw("DATE_FORMAT(TANGGALDAFTAR, '%Y-%m')")
    .orderByRaw("DATE_FORMAT(TANGGALDAFTAR, '%Y-%m') DESC")
    .limit(7);
