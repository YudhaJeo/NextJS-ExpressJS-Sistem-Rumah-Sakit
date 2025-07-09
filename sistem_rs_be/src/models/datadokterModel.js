import db from '../core/config/knex.js';

export const getAll = () => {
  return db('data_dokter as d')
    .leftJoin('poli as p', 'd.IDPOLI', 'p.IDPOLI')
    .select(
      'd.IDDOKTER',
      'd.NAMA_DOKTER',
      'p.NAMAPOLI as POLI', // Ganti IDPOLI dengan NAMAPOLI
      'd.JADWALPRAKTEK',
      'd.NO_TELEPON',
      'd.EMAIL',
      'd.ALAMAT',
      'd.JENIS_KELAMIN'
    );
};


export const getById = (id) => {
  return db('data_dokter').where('IDDOKTER', id).first();
};

export const create = (data) => {
  return db('data_dokter').insert(data);
};

export const update = (id, data) => {
  return db('data_dokter').where('IDDOKTER', id).update(data);
};

export const remove = (id) => {
  return db('data_dokter').where('IDDOKTER', id).del();
};
