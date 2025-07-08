// src/models/jenisKamarModel.js
import db from '../core/config/knex.js';

export const getAll = () => 
    db('jenis_kamar').select();

export const getById = (id) => 
    db('jenis_kamar').where({ IDJENISKAMAR: id }).first();

export const create = (data) => 
    db('jenis_kamar').insert(data);

export const update = (id, data) =>
    db('jenis_kamar').where({ IDJENISKAMAR: id }).update(data);
  
export const remove = (id) =>
    db('jenis_kamar').where({ IDJENISKAMAR: id }).del();