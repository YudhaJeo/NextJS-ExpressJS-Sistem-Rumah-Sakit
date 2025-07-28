import db from '../core/config/knex.js';

export const getAll = () => {
  return db('angsuran')
    .join('invoice', 'angsuran.IDINVOICE', 'invoice.IDINVOICE')
    .leftJoin('bank_account', 'angsuran.IDBANK', 'bank_account.IDBANK')
    .select(
      'angsuran.*',
      'invoice.NOINVOICE',
      'bank_account.NAMA_BANK'
    )
    .orderBy('angsuran.TANGGALBAYAR', 'asc');
};

export const getById = (id) => {
  return db('angsuran')
    .where('IDANGSURAN', id)
    .first();
};

export const getByInvoice = (idInvoice) => {
  return db('angsuran')
    .where('IDINVOICE', idInvoice)
    .orderBy('TANGGALBAYAR', 'asc');
};

export const create = (data, trx = db) => {
  return trx('angsuran').insert(data);
};

export const update = (id, data) => {
  return db('angsuran').where('IDANGSURAN', id).update(data);
};

export const remove = (id) => {
  return db('angsuran').where('IDANGSURAN', id).del();
};