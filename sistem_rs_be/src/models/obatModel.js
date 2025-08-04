import db from '../core/config/knex.js';

export const getAll = () =>
    db('obat as o')
        .leftJoin('master_supplier as s', 'o.SUPPLIERID', 's.SUPPLIERID')
        .select(
            'o.*',
            's.NAMASUPPLIER'
        );

export const getById = (id) =>
    db('obat as o')
        .leftJoin('master_supplier as s', 'o.SUPPLIERID', 's.SUPPLIERID')
        .select('o.*', 's.NAMASUPPLIER')
        .where('o.IDOBAT', id)
        .first();

export const createObat = (data) =>
    db('obat').insert({
        NAMAOBAT: data.NAMAOBAT,
        JENISOBAT: data.JENISOBAT,
        STOK: data.STOK || 0,
        HARGABELI: data.HARGABELI,
        HARGAJUAL: data.HARGAJUAL,
        TGLKADALUARSA: data.TGLKADALUARSA,
        SUPPLIERID: data.SUPPLIERID || null,
    });

export const updateObat = (id, data) =>
    db('obat')
        .where({ IDOBAT: id })
        .update({
            NAMAOBAT: data.NAMAOBAT,
            JENISOBAT: data.JENISOBAT,
            STOK: data.STOK,
            HARGABELI: data.HARGABELI,
            HARGAJUAL: data.HARGAJUAL,
            TGLKADALUARSA: data.TGLKADALUARSA,
            SUPPLIERID: data.SUPPLIERID || null,
            UPDATED_AT: db.fn.now(),
        });

export const remove = (id) =>
    db('obat').where({ IDOBAT: id }).delete();