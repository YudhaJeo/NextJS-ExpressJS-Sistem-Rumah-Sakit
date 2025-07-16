import db from '../core/config/knex.js';

export const getAll = () => {
  return db('kamar')
    .join('bangsal', 'kamar.IDBANGSAL', 'bangsal.IDBANGSAL')
    .select(
      'kamar.*',
      'bangsal.NAMABANGSAL',
      'bangsal.LOKASI'
    );
};

export const getByNama = (nama) => {
  return db('kamar').where({ NAMAKAMAR: nama }).first();
};

export const create = (data) => {
  return db('kamar').insert(data);
};

export const update = (id, data) => {
  return db('kamar')
    .where({ IDKAMAR: id })
    .update({
      ...data,
      UPDATED_AT: db.fn.now(),
    });
};

export const deleteById = (id) => {
  return db('kamar').where({ IDKAMAR: id }).del();
};
