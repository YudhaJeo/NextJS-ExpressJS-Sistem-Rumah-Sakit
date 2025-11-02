import db from '../core/config/knex.js';

export const getAll = () => db('berita').select();

export const getById = (id) => {
  return db('berita').where('IDBERITA', id).first();
};

export const create = (data) => {
  return db('berita').insert(data);
};

export const update = (id, data) => {
  return db('berita').where('IDBERITA', id).update(data);
};

export const remove = (id) => {
  return db('berita').where('IDBERITA', id).del();
};