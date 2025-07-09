// src/models/bangsalModel.js
import db from '../core/config/knex.js';

export const getAll = () => {
  return db('bangsal')
    .join('jenis_bangsal', 'bangsal.IDJENISBANGSAL', 'jenis_bangsal.IDJENISBANGSAL')
    .select(
      'bangsal.*',
      'jenis_bangsal.NAMAJENIS'
    );
};

export const getByNama = (nama) => {
  return db('bangsal').where({ NAMABANGSAL: nama }).first();
};

export const create = (data) => {
  return db('bangsal').insert(data);
};

export const update = (id, data) => {
  return db('bangsal').where({ IDBANGSAL: id }).update(data);
};
