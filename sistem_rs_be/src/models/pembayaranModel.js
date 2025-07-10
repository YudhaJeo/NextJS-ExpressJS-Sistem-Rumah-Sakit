import db from '../core/config/knex.js';

export const getAll = () => {
  return db('pembayaran')
    .join('invoice', 'pembayaran.IDINVOICE', 'invoice.IDINVOICE')
    .join('pasien', 'pembayaran.NIK', 'pasien.NIK')
    .leftJoin('asuransi', 'pembayaran.IDASURANSI', 'asuransi.IDASURANSI')
    .select(
      'pembayaran.*',
      'invoice.NOINVOICE',
      'pasien.NAMALENGKAP as NAMAPASIEN',
      'asuransi.NAMAASURANSI as ASURANSI'
    );
};

export const getById = (id) => {
  return db('pembayaran')
    .join('invoice', 'pembayaran.IDINVOICE', 'invoice.IDINVOICE')
    .join('pasien', 'pembayaran.NIK', 'pasien.NIK')
    .leftJoin('asuransi', 'pembayaran.IDASURANSI', 'asuransi.IDASURANSI')
    .select(
      'pembayaran.*',
      'invoice.NOINVOICE',
      'pasien.NAMALENGKAP as NAMAPASIEN',
      'asuransi.NAMAASURANSI as ASURANSI'
    )
    .where('pembayaran.IDPEMBAYARAN', id)
    .first();
};

export const create = (data, trx) => {
  return db('pembayaran').transacting(trx).insert(data);
};

export const update = (id, data) => {
  return db('pembayaran').where('IDPEMBAYARAN', id).update(data);
};

export const remove = (id) => {
  return db('pembayaran').where('IDPEMBAYARAN', id).del();
};