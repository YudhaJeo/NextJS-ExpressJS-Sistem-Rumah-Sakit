import db from '../core/config/knex.js';

export const getAll = () =>
  db('alkes').select('*').orderBy('IDALKES', 'desc');

export const getById = (id) =>
  db('alkes').where({ IDALKES: id }).first()  ;

export const createAlkes = (data) =>
  db('alkes').insert({
    KODEALKES: data.KODEALKES,
    NAMAALKES: data.NAMAALKES,
    MERKALKES: data.MERKALKES,
    JENISALKES: data.JENISALKES,
    STOK: data.STOK || 0,
    HARGABELI: data.HARGABELI,
    HARGAJUAL: data.HARGAJUAL,
    LOKASI: data.LOKASI,
    DESKRIPSI: data.DESKRIPSI || null,
  });

export const updateAlkes = (id, data) =>
  db('alkes')
    .where({ IDALKES: id })
    .update({
      KODEALKES: data.KODEALKES,
      NAMAALKES: data.NAMAALKES,
      MERKALKES: data.MERKALKES,
      JENISALKES: data.JENISALKES,
      STOK: data.STOK,
      HARGABELI: data.HARGABELI,
      HARGAJUAL: data.HARGAJUAL,
      LOKASI: data.LOKASI,
      DESKRIPSI: data.DESKRIPSI || null,
      UPDATED_AT: db.fn.now(),
    });

export const remove = (id) =>
  db('alkes').where({ IDALKES: id }).delete();