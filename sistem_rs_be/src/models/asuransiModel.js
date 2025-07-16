import db from '../core/config/knex.js';

export const getAll = () => db('asuransi').select();

export const getById = (id) =>
  db('asuransi').where({ IDASURANSI: id }).first();

export const create = (data) =>
  db('asuransi').insert(data);

export const update = (id, data) =>
  db('asuransi').where({ IDASURANSI: id }).update(data);

export const remove = (id) =>
  db('asuransi').where({ IDASURANSI: id }).del();
