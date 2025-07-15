import db from '../core/config/knex.js';

const TABLE = 'master_tenaga_medis';

export const getAll = () => {
  return db(TABLE).select('*');
};

export const getById = (id) => {
  return db(TABLE).where('IDTENAGAMEDIS', id).first();
};

export const create = (data) => {
  return db(TABLE).insert(data);
};

export const update = (id, data) => {
  // ⛔ Hapus CREATED_AT jika ada
  const { CREATED_AT, ...safeData } = data;

  // ⛔ Filter out undefined/null values (optional)
  const cleanData = Object.fromEntries(
    Object.entries(safeData).filter(([_, v]) => v !== undefined && v !== null)
  );

  return db(TABLE)
    .where('IDTENAGAMEDIS', id)
    .update(cleanData);
};

export const remove = (id) => {
  return db(TABLE).where('IDTENAGAMEDIS', id).del();
};