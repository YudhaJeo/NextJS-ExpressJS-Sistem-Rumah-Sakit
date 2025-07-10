import db from '../core/config/knex.js';

export const getAll = () => {
  return db('bank_account').select('*');
};

export const create = (data) => {
  return db('bank_account').insert(data);
};

export const update = (id, data) => {
  return db('bank_account').where('IDBANK', id).update(data);
};

export const remove = (id) => {
  return db('bank_account').where('IDBANK', id).del();
};