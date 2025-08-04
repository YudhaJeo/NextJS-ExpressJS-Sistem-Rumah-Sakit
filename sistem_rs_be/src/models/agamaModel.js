import db from '../core/config/knex.js';

export const getAll = () =>
    db('agama').select();

export const getById = (id) =>
    db('agama').where({ IDAGAMA: id }).first();

export const create = (data) =>
    db('agama').insert(data);

export const update = (id, data) =>
    db('agama').where({ IDAGAMA: id }).update(data);

export const remove = (id) =>
    db('agama').where({ IDAGAMA: id }).del();