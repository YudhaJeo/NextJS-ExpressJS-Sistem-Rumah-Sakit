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
        NAMAALKES: data.NAMAALKES,
        JENISALKES: data.JENISALKES,
        STOK: data.STOK || 0,
        HARGABELI: data.HARGABELI,
        HARGAJUAL: data.HARGAJUAL,
        TGLKADALUARSA: data.TGLKADALUARSA,
        SUPPLIERID: data.SUPPLIERID || null,
    });

export const updateAlkes = (id, data) =>
    db('master_alkes')
        .where({ IDALKES: id })
        .update({
            NAMAALKES: data.NAMAALKES,
            JENISALKES: data.JENISALKES,
            STOK: data.STOK,
            HARGABELI: data.HARGABELI,
            HARGAJUAL: data.HARGAJUAL,
            TGLKADALUARSA: data.TGLKADALUARSA,
            SUPPLIERID: data.SUPPLIERID || null,
            UPDATED_AT: db.fn.now(),
        });

export const remove = (id) =>
  db('master_alkes').where({ IDALKES: id }).delete();