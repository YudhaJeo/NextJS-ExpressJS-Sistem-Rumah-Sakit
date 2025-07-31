import db from '../core/config/knex.js';

export const getAll = () => {
  return db('deposit_penggunaan')
    .join('deposit', 'deposit_penggunaan.IDDEPOSIT', 'deposit.IDDEPOSIT')
    .join('invoice', 'deposit_penggunaan.IDINVOICE', 'invoice.IDINVOICE')
    .join('pasien', 'invoice.NIK', 'pasien.NIK') // ubah relasi NIK dari invoice, bukan deposit
    .select(
      'deposit_penggunaan.*',
      'deposit.NODEPOSIT',
      'invoice.NOINVOICE',
      'pasien.NIK',
      'pasien.NAMALENGKAP as NAMAPASIEN'
    );
};

export const getById = (id) => {
  return db('deposit_penggunaan')
    .join('deposit', 'deposit_penggunaan.IDDEPOSIT', 'deposit.IDDEPOSIT')
    .join('invoice', 'deposit_penggunaan.IDINVOICE', 'invoice.IDINVOICE')
    .join('pasien', 'invoice.NIK', 'pasien.NIK') // sama: dari invoice
    .select(
      'deposit_penggunaan.*',
      'deposit.NODEPOSIT',
      'invoice.NOINVOICE',
      'pasien.NIK',
      'pasien.NAMALENGKAP as NAMAPASIEN'
    )
    .where('deposit_penggunaan.IDPENGGUNAAN', id)
    .first();
};

export const create = (data, trx) => {
  return db('deposit_penggunaan').transacting(trx).insert(data);
};

export const update = (id, data) => {
  return db('deposit_penggunaan').where('IDPENGGUNAAN', id).update(data);
};

export const remove = (id) => {
  return db('deposit_penggunaan').where('IDPENGGUNAAN', id).del();
};