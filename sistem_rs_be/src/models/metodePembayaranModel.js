import db from '../core/config/knex.js';

export const getAll = () => {
  return db('metode_pembayaran').select('*');
};

export const create = (data) => {
  return db('metode_pembayaran').insert(data);
};

export const update = (id, data) => {
  return db('metode_pembayaran').where('IDMETODE', id).update(data);
};

export const remove = (id) => {
  return db('metode_pembayaran').where('IDMETODE', id).del();
};