import db from '../core/config/knex.js';

export const getAll = () => {
  return db('loket').select('*');
};

export const create = (data) => {
  return db('loket').insert(data);
};

export const update = (id, data) => {
  return db('loket').where('IDLOKET', id).update(data);
};

export const remove = (id) => {
  return db('loket').where('IDLOKET', id).del();
};

export const getById = (id) => {
  return db('loket').where('IDLOKET', id).first();
};