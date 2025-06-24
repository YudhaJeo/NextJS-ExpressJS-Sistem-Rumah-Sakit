import db from '../core/config/knex.js';

export const getAll = () => {
  return db('pasien').select();
};

export const getById = (id) => {
  return db('pasien').where({ ID: id }).first();
};

export const create = (data) => {
  return db('pasien').insert(data);
};

export const update = (id, data) => {
  return db('pasien')
    .where({ ID: id })
    .update({ ...data, UPDATEDAT: db.fn.now() });
};

export const remove = (id) => {
  return db('pasien').where({ ID: id }).del();
};
