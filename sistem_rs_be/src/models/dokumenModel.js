import db from '../core/config/knex.js';

export const getAll = () => {
  return db('dokumen')
    .join('pasien', 'dokumen.NIK', 'pasien.NIK')
    .select('dokumen.*', 'pasien.NAMALENGKAP');
};

export const getById = (id) => {
  return db('dokumen').where('IDDOKUMEN', id ).first();
};

export const getByNIK = (nik) => {
  return db('dokumen').where('NIK', nik );
};

export const create = (data) => {
  return db('dokumen').insert(data);
};

export const update = (id, data) => {
  return db('dokumen').where('IDDOKUMEN', id ).update(data);
};

export const remove = (id) => {
  return db('dokumen').where('IDDOKUMEN', id ).del();
};