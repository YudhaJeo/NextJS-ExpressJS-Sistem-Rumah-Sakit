import db from '../core/config/knex.js';

export const getAll = () => {
  return db('fefo as f')
    .leftJoin('obat as o', function () {
      this.on('f.ITEMID', '=', 'o.IDOBAT').andOn('f.TIPE', '=', db.raw("'OBAT'"));
    })
    .leftJoin('master_alkes as a', function () {
      this.on('f.ITEMID', '=', 'a.IDALKES').andOn('f.TIPE', '=', db.raw("'ALKES'"));
    })
    .select(
      'f.*',
      db.raw("COALESCE(o.NAMAOBAT, a.NAMAALKES) as NAMAITEM")
    )
    .orderBy('f.TGLKADALUARSA', 'asc');
};

export const getById = (id) => db('fefo').where({ IDBATCH: id }).first();

export const updateStok = (id, stok) => db('fefo').where({ IDBATCH: id }).update({ STOK: stok });

export const insertBatch = (batchData) => db('fefo').insert(batchData);
