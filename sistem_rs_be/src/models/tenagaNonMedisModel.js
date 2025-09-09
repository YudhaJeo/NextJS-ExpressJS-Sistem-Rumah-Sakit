import db from '../core/config/knex.js';

const TABLE = 'master_tenaga_non_medis';

export const findByEmail = (email) => {
  return db(TABLE)
    .join('role', `${TABLE}.JENISTENAGANONMEDIS`, '=', 'role.IDROLE')
    .where(`${TABLE}.EMAIL`, email)
    .first(`${TABLE}.*`, 'role.NAMAROLE');
};

export const getAll = () => {
  return db(TABLE).select('*');
};

export const getById = (id) => {
  return db(TABLE).where('IDTENAGANONMEDIS', id).first();
};

export const getLastKode = () => {
  return db(TABLE).orderBy('IDTENAGANONMEDIS', 'desc').first('KODETENAGANONMEDIS');
};

export const create = (data) => {
  return db(TABLE).insert(data);
};

export const update = (id, data) => {
  const { PASSWORD, CREATED_AT, ...safeData } = data;

  const cleanData = Object.fromEntries(
    Object.entries(safeData).filter(([_, v]) => v !== undefined && v !== null)
  );

  return db(TABLE)
    .where('IDTENAGANONMEDIS', id)
    .update(cleanData);
};

export const remove = (id) => {
  return db(TABLE).where('IDTENAGANONMEDIS', id).del();
};