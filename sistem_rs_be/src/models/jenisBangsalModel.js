// src/models/jenisBangsalModel.js
import db from '../core/config/knex.js';

export const getAll = () => 
    db('jenis_bangsal').select();

export const getById = (id) => 
    db('jenis_bangsal').where({ IDJENISBANGSAL: id }).first();

export const create = (data) => 
    db('jenis_bangsal').insert(data);

export const update = (id, data) =>
    db('jenis_bangsal').where({ IDJENISBANGSAL: id }).update(data);
  
export const remove = (id) =>
    db('jenis_bangsal').where({ IDJENISBANGSAL: id }).del();
