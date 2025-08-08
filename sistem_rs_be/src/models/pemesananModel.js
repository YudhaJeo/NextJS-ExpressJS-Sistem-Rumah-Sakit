import db from '../core/config/knex.js';

export const getAllPemesanan = () =>
  db('pemesanan as p')
    .leftJoin('master_supplier as s', 'p.SUPPLIERID', 's.SUPPLIERID')
    .select('p.*', 's.NAMASUPPLIER');

export const getPemesananDetail = (id) =>
  db('pemesanan_detail as pd')
    .leftJoin('obat as o', function () {
      this.on('pd.IDBARANG', '=', 'o.IDOBAT')
          .andOn('pd.JENISBARANG', '=', db.raw('?', ['OBAT']));
    })
    .leftJoin('master_alkes as a', function () {
      this.on('pd.IDBARANG', '=', 'a.IDALKES')
          .andOn('pd.JENISBARANG', '!=', db.raw('?', ['OBAT']));
    })
    .select(
      'pd.IDBARANG', // tetap dikirim
      'pd.JENISBARANG',
      'pd.QTY',
      'pd.HARGABELI',
      db.raw(`
        CASE 
          WHEN pd.JENISBARANG = 'OBAT' THEN o.NAMAOBAT
          ELSE a.NAMAALKES
        END as NAMABARANG
      `)
    )
    .where('pd.IDPEMESANAN', id);


export const createPemesanan = (data) =>
  db('pemesanan').insert(data);

export const createPemesananDetail = (details) =>
  db('pemesanan_detail').insert(details);

export const updatePemesananStatus = async (id, status) => {
  const existing = await db('pemesanan').where({ IDPEMESANAN: id }).first();
  if (!existing) throw new Error('Pemesanan tidak ditemukan');

  await db('pemesanan').where({ IDPEMESANAN: id }).update({
    STATUS: status,
    UPDATED_AT: db.fn.now(),
  });

  const details = await db('pemesanan_detail').where({ IDPEMESANAN: id });

  if (status === 'DITERIMA') {
    for (const item of details) {
      if (item.JENISBARANG === 'OBAT') {
        await db('obat')
          .where('IDOBAT', item.IDBARANG)
          .increment('STOK', item.QTY)
          .update({ HARGABELI: item.HARGABELI });
      } else {
        await db('master_alkes')
          .where('IDALKES', item.IDBARANG)
          .increment('STOK', item.QTY)
          .update({ HARGABELI: item.HARGABELI });
      }
    }
  }

  if (status === 'DIBATALKAN' && existing.STATUS === 'DITERIMA') {
    for (const item of details) {
      if (item.JENISBARANG === 'OBAT') {
        await db('obat')
          .where('IDOBAT', item.IDBARANG)
          .decrement('STOK', item.QTY);
      } else {
        await db('master_alkes')
          .where('IDALKES', item.IDBARANG)
          .decrement('STOK', item.QTY);
      }
    }
  }
};
