import db from '../core/config/knex.js';

export const getAll = () => {
  return db('metode_pembayaran')
    .leftJoin('bank_account', 'metode_pembayaran.IDBANK', 'bank_account.IDBANK')
    .select(
      'metode_pembayaran.*',
      'bank_account.NAMA_BANK',
      'bank_account.NO_REKENING',
      'bank_account.ATAS_NAMA'
    );
};

export const create = (data) => {
  return db('metode_pembayaran').insert(data);
};

export const update = (id, data) => {
  return db('metode_pembayaran').where('IDMETODE', id).update(data);
};

export const remove = (id) => {
  return db('metode_pembayaran').where('IDMETODE', id).del();
};