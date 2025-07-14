// src/models/obatModel.js
import db from '../core/config/knex.js';

export const getAll = () =>
    db('obat').select();

export const getById = (id) =>
    db('obat').where({ IDOBAT: id}).first();
