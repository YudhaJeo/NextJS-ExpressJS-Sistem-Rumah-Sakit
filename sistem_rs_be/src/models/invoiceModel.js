import db from '../core/config/knex.js';

const table = 'invoice';

export const getAll = () => {
  return db(table)
    .join('pasien', `${table}.NIK`, 'pasien.NIK')
    .leftJoin('asuransi', `${table}.IDASURANSI`, 'asuransi.IDASURANSI')
    .select(
      `${table}.*`,
      'pasien.NAMALENGKAP',
      'asuransi.NAMAASURANSI'
    );
};

export const getById = (id) => {
  return db(table)
    .join('pasien', `${table}.NIK`, 'pasien.NIK')
    .leftJoin('asuransi', `${table}.IDASURANSI`, 'asuransi.IDASURANSI')
    .select(
      `${table}.*`,
      'pasien.NAMALENGKAP',
      'asuransi.NAMAASURANSI'
    )
    .where(`${table}.IDINVOICE`, id)
    .first();
};

export const create = (data) => {
  return db(table).insert(data);
};

export const update = (id, data) => {
  return db(table)
    .where('IDINVOICE', id)
    .update({ ...data, UPDATED_AT: db.fn.now() });
};

export const remove = (id) => {
  return db(table)
    .where('IDINVOICE', id)
    .del();
};