import db from '../core/config/knex.js';

export const getRiwayatKunjungan = () => {
  return db('pendaftaran as p')
    .join('pasien as ps', 'p.NIK', 'ps.NIK')
    .join('poli as pl', 'p.IDPOLI', 'pl.IDPOLI')
    .leftJoin('rawat_jalan as r', 'p.IDPENDAFTARAN', 'r.IDPENDAFTARAN')
    .leftJoin('master_tenaga_medis as d', 'r.IDDOKTER', 'd.IDTENAGAMEDIS')
    .select(
      'p.IDPENDAFTARAN',
      'ps.NAMALENGKAP',
      'p.NIK',
      'p.TANGGALKUNJUNGAN',
      'p.KELUHAN',
      'pl.NAMAPOLI as POLI',
      'p.STATUSKUNJUNGAN',
      'r.STATUSRAWAT',
      'r.DIAGNOSA',
      'r.OBAT',
      'd.NAMALENGKAP as NAMADOKTER'
    )
    .where('p.STATUSKUNJUNGAN', 'Selesai')
    .orderBy('p.TANGGALKUNJUNGAN', 'desc');
};