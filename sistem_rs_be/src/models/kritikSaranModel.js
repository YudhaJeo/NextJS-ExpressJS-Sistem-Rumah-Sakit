import db from '../core/config/knex.js';

export const getAll = async () => {
  return db('kritik_saran').select('*');
};

export const getById = async (id) => {
  return db('kritik_saran').where({ IDKRITIKSARAN: id }).first();
};
