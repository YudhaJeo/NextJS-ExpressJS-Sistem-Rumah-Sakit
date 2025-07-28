import db from '../core/config/knex.js';

export const getAll = () => {
  return db('invoice')
    .join('pasien', 'invoice.NIK', 'pasien.NIK')
    .leftJoin('asuransi', 'pasien.IDASURANSI', 'asuransi.IDASURANSI')
    .select(
      'invoice.*',
      'pasien.NAMALENGKAP as NAMAPASIEN',
      'asuransi.NAMAASURANSI as ASURANSI'
    );
};

export const update = (id, data) => {
  return db('invoice').where('IDINVOICE', id).update(data);
};

export const remove = (id) => {
  return db('invoice').where('IDINVOICE', id).del();
};