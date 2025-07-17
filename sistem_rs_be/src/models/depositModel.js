import db from '../core/config/knex.js';

export const getAll = () => {
  return db('deposit')
    .join('pasien', 'deposit.NIK', 'pasien.NIK')
    .select(
      'deposit.*',
      'pasien.NAMALENGKAP as NAMAPASIEN'
    );
};

export const getById = (id) => {
  return db('deposit')
    .join('pasien', 'deposit.NIK', 'pasien.NIK')
    .select(
      'deposit.*',
      'pasien.NAMALENGKAP as NAMAPASIEN'
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