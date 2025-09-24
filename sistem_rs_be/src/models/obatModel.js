import db from '../core/config/knex.js';

export const getAll = () =>
  db('obat').select('*').orderBy('IDOBAT', 'desc');

export const getById = (id) =>
    db('obat').where({ IDOBAT: id }).first();

export const createObat = (data) =>
    db('obat').insert({
        KODEOBAT: data.KODEOBAT,
        NAMAOBAT: data.NAMAOBAT,
        MERKOBAT: data.MERKOBAT,
        JENISOBAT: data.JENISOBAT,
        STOK: data.STOK || 0,
        HARGABELI: data.HARGABELI,
        HARGAJUAL: data.HARGAJUAL,
        LOKASI: data.LOKASI,
        DESKRIPSI: data.DESKRIPSI,
    });

export const updateObat = (id, data) =>
    db('obat')
        .where({ IDOBAT: id })
        .update({
            KODEOBAT: data.KODEOBAT,
            NAMAOBAT: data.NAMAOBAT,
            MERKOBAT: data.MERKOBAT,
            JENISOBAT: data.JENISOBAT,
            STOK: data.STOK,
            HARGABELI: data.HARGABELI,
            HARGAJUAL: data.HARGAJUAL,
            LOKASI: data.LOKASI,
            DESKRIPSI: data.DESKRIPSI,
            UPDATED_AT: db.fn.now(),
        });

export const remove = (id) =>
    db('obat').where({ IDOBAT: id }).delete();