import db from '../core/config/knex.js';

export const getAll = () => {
  return db('deposit')
    .join('invoice', 'deposit.IDINVOICE', 'invoice.IDINVOICE')
    .join('pasien', 'invoice.NIK', 'pasien.NIK')
    .leftJoin('bank_account', 'deposit.IDBANK', 'bank_account.IDBANK')
    .select(
      'deposit.*',
      'invoice.NOINVOICE',
      'pasien.NAMALENGKAP as NAMAPASIEN',
      'pasien.NIK',
      'bank_account.NAMA_BANK'
    );
};

export const getById = (id) => {
  return db('deposit')
    .join('invoice', 'deposit.IDINVOICE', 'invoice.IDINVOICE')
    .join('pasien', 'invoice.NIK', 'pasien.NIK')
    .leftJoin('bank_account', 'deposit.IDBANK', 'bank_account.IDBANK')
    .select(
      'deposit.*',
      'invoice.NOINVOICE',
      'pasien.NAMALENGKAP as NAMAPASIEN',
      'pasien.NIK',
      'bank_account.NAMA_BANK'
    )
    .where('deposit.IDDEPOSIT', id)
    .first();
};

export const create = (data) => {
  return db('deposit').insert(data);
};

export const update = (id, data) => {
  return db('deposit').where('IDDEPOSIT', id).update(data);
};

export const remove = (id) => {
  return db('deposit').where('IDDEPOSIT', id).del();
};