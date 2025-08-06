import db from '../core/config/knex.js';

export const getAll = () =>
  db('master_alkes as a')
    .leftJoin('master_supplier as s', 'a.SUPPLIERID', 's.SUPPLIERID')
    .select(
      'a.*',
      's.NAMASUPPLIER'
    );

export const getById = (id) =>
  db('master_alkes as a')
    .leftJoin('master_supplier as s', 'a.SUPPLIERID', 's.SUPPLIERID')
    .select('a.*', 's.NAMASUPPLIER')
    .where('a.IDALKES', id)
    .first();

export const createAlkes = (data) =>
  db('master_alkes').insert({
    KODEALKES: data.KODEALKES,
    NAMAALKES: data.NAMAALKES,
    MERKALKES: data.MERKALKES,
    JENISALKES: data.JENISALKES,
    STOK: data.STOK || 0,
    HARGABELI: data.HARGABELI,
    HARGAJUAL: data.HARGAJUAL,
    TGLKADALUARSA: data.TGLKADALUARSA,
    LOKASI: data.LOKASI,
    SUPPLIERID: data.SUPPLIERID || null,
    KETERANGAN: data.KETERANGAN || null,
  });

export const updateAlkes = (id, data) =>
  db('master_alkes')
    .where({ IDALKES: id })
    .update({
      KODEALKES: data.KODEALKES,
      NAMAALKES: data.NAMAALKES,
      MERKALKES: data.MERKALKES,
      JENISALKES: data.JENISALKES,
      STOK: data.STOK,
      HARGABELI: data.HARGABELI,
      HARGAJUAL: data.HARGAJUAL,
      TGLKADALUARSA: data.TGLKADALUARSA,
      LOKASI: data.LOKASI,
      SUPPLIERID: data.SUPPLIERID || null,
      KETERANGAN: data.KETERANGAN || null,
      UPDATED_AT: db.fn.now(),
    });

export const remove = (id) =>
  db('master_alkes').where({ IDALKES: id }).delete();