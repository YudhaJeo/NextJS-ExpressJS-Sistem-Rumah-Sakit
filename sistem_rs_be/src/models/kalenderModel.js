import db from '../core/config/knex.js';

export const getAll = () => {
  return db('kalender')
    .join('dokter', 'kalender.IDDOKTER', 'dokter.IDDOKTER')
    .join('master_tenaga_medis', 'dokter.IDTENAGAMEDIS', 'master_tenaga_medis.IDTENAGAMEDIS')
    .select(
      'kalender.*',
      'dokter.IDDOKTER',
      'master_tenaga_medis.NAMALENGKAP as NAMA_DOKTER'
    );
};

export const create = (data) => {
  return db('kalender').insert(data);
};

export const update = (id, data) => {
  return db('kalender').where('ID', id).update(data);
};

export const remove = (id) => {
  return db('kalender').where('ID', id).del();
};

export const getById = (id) => {
  return db('kalender')
    .join('dokter', 'kalender.IDDOKTER', 'dokter.IDDOKTER')
    .join('master_tenaga_medis', 'dokter.IDTENAGAMEDIS', 'master_tenaga_medis.IDTENAGAMEDIS')
    .select(
      'kalender.*',
      'dokter.IDDOKTER',
      'master_tenaga_medis.NAMALENGKAP as NAMA_DOKTER'
    )
    .where('kalender.ID', id)
    .first();
};
