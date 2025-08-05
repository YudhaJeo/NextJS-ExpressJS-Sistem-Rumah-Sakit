import db from '../core/config/knex.js';

export const getAll = () =>
  db('kartu_stok')
    .join('obat', 'kartu_stok.IDOBAT', 'obat.IDOBAT')
    .join('master_alkes', 'kartu_stok.IDALKES', 'master_alkes.IDALKES')
    .select(
      'kartu_stok.*',
      'obat.NAMAOBAT',
      'master_alkes.NAMAALKES'
    );


export const getById = (id) =>
  db('kartu_stok')
    .where({ IDKARTU: id })
    .first();

export const create = (data) =>
  db('kartu_stok').insert(data);

export const update = (id, data) =>
  db('kartu_stok')
    .where({ IDKARTU: id })
    .update({ ...data, UPDATED_AT: db.fn.now() });

export const remove = (id) =>
  db('kartu_stok').where({ IDKARTU: id }).delete();