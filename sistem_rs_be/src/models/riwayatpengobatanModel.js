import db from '../core/config/knex.js';

export const getAllPengobatan = () => {
  return db('riwayat_pengobatan')
    .join('pendaftaran', 'riwayat_pengobatan.IDPENDAFTARAN', 'pendaftaran.IDPENDAFTARAN')
    .join('pasien', 'pendaftaran.NIK', 'pasien.NIK')
    .join('poli', 'pendaftaran.IDPOLI', 'poli.IDPOLI')
    .select(
      'riwayat_pengobatan.*',
      'pendaftaran.TANGGALKUNJUNGAN',
      'pendaftaran.KELUHAN',
      'pendaftaran.STATUSKUNJUNGAN',
      'pasien.NIK',
      'pasien.NAMALENGKAP',
      'poli.NAMAPOLI as POLI'
    )
    .orderBy('riwayat_pengobatan.IDPENGOBATAN', 'desc');
};

export const createPengobatan = (data) => { 
  return db('riwayat_pengobatan').insert(data);
};
export const updatePengobatan = (id, data) => {
  return db('riwayat_pengobatan').where('IDPENGOBATAN', id).update(data);
};
export const deletePengobatan = (id) => {
  return db('riwayat_pengobatan').where('IDPENGOBATAN', id).del();
};
