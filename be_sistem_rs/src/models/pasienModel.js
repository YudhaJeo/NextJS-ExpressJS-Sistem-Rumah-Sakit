import db from '../core/config/knex.js';

export const getAll = () => db('pasien').select();
export const getById = (id) => db('pasien').where({ IDPASIEN: id }).first();
export const create = (data) => db('pasien').insert(data);
export const update = (id, data) => db('pasien').where({ IDPASIEN: id }).update(data);
export const remove = (id) => db('pasien').where({ IDPASIEN: id }).del();