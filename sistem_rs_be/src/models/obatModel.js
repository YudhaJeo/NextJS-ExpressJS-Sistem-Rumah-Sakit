import db from '../core/config/knex.js';

export const getAll = () =>
    db('obat').select();

export const getById = (id) =>
    db('obat').where({ IDOBAT: id }).first();

export const createObat = (data) =>
    db('obat').insert(data);

export const updateObat = (id, data) =>
    db('obat').where({ IDOBAT: id }).update(data);

export const remove = (id) =>
    db('obat').where({ IDOBAT: id }).delete();
