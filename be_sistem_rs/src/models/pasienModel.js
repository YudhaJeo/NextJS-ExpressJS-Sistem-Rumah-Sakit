import db from '../core/config/knex.js';

export const getAll = () => {
  return db('pasien').select();
};

export const getById = (id) => {
  return db('pasien').where({ IDPASIEN: id }).first();
};

export const create = (data) => {
  return db('pasien').insert(data);
};

export const update = (id, data) => {
  return db('pasien').where({ IDPASIEN: id }).update(data);
};

export const remove = (id) => {
  return db('pasien').where({ IDPASIEN: id }).del();
};