import db from '../core/config/knex.js';

export const getRiwayatKunjungan = () => {
  return db('pendaftaran as p')
    .join('pasien as ps', 'p.NIK', 'ps.NIK')
    .join('poli as pl', 'p.IDPOLI', 'pl.IDPOLI')
    .select(
      'p.IDPENDAFTARAN',
      'ps.NAMALENGKAP',
      'p.NIK',
      'p.TANGGALKUNJUNGAN',
      'p.KELUHAN',
      'pl.NAMAPOLI as POLI',
      'p.STATUSKUNJUNGAN'
    )
    .where('p.STATUSKUNJUNGAN', 'Selesai');
};