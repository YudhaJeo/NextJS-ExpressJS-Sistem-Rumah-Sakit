import db from '../core/config/knex.js';

export const getAll = () => {
  return db('printer').select('*');
};

export const create = (data) => {
  return db('printer').insert(data);
};

export const update = (id, data) => {
  return db('printer').where('NOPRINTER', id).update(data);
};

export const remove = (id) => {
  return db('printer').where('NOPRINTER', id).del();
};