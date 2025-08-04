import db from '../core/config/knex.js';

export const getAll = () => {
  return db('pendaftaran')
    .join('pasien', 'pendaftaran.NIK', 'pasien.NIK')
    .join('poli', 'pendaftaran.IDPOLI', 'poli.IDPOLI')
    .select(
      'pendaftaran.IDPENDAFTARAN',
      'pendaftaran.NIK',
      'pasien.NAMALENGKAP',
      'pendaftaran.TANGGALKUNJUNGAN',
      'pendaftaran.KELUHAN',
      'pendaftaran.STATUSKUNJUNGAN',
      'poli.NAMAPOLI as POLI'
    );
};

export const create = async (data, trx = db) => {
  const result = await trx('pendaftaran').insert(data);
  return result[0];
};

export const update = (id, data) => {
  return db('pendaftaran').where('IDPENDAFTARAN', id).update(data);
};

export const remove = (id) => {
  return db('pendaftaran').where('IDPENDAFTARAN', id).del();
};

export const startTransaction = () => {
  return db.transaction();
};
