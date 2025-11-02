import db from '../core/config/knex.js';

export const getAll = () => {
  return db('notifikasi_user')
    .join('pasien', 'notifikasi_user.NIK', 'pasien.NIK')
    .leftJoin('poli', 'notifikasi_user.IDPOLI', 'poli.IDPOLI')
    .leftJoin('dokter', 'notifikasi_user.IDDOKTER', 'dokter.IDDOKTER')
    .leftJoin('master_tenaga_medis', 'dokter.IDTENAGAMEDIS', 'master_tenaga_medis.IDTENAGAMEDIS')
    .select(
      'notifikasi_user.*',
      'pasien.NAMALENGKAP as NAMAPASIEN',
      'poli.NAMAPOLI',
      'master_tenaga_medis.NAMALENGKAP as NAMADOKTER'
    );
};

export const startTransaction = () => {
  return db.transaction();
};
