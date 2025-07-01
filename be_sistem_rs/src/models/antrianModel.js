import db from '../core/config/knex.js';

export const findAllAntrian = () => {
  return db('antrian')
    .join('loket', 'antrian.LOKET_ID', 'loket.NO')
    .select('antrian.*', 'loket.NAMALOKET as LOKET');
};

export const findAntrianById = (id) => {
  return db('antrian').where({ ID: id }).first();
};

export const createAntrian = (data) => {
  return db('antrian').insert(data);
};

export const updateStatusAntrian = (id, status = 'Sudah') => {
  return db('antrian').where({ ID: id }).update({ STATUS: status });
};

export const deleteAntrian = (id) => {
  return db('antrian').where({ ID: id }).del();
};