import db from '../core/config/knex.js'

export const insert = async (data) => {
  return await db('riwayat_obat_inap').insert(data).returning('*');
};

export const getAll = async () => {
  return await db('riwayat_obat_inap');
};

export const getById = async (id) => {
  return await db('riwayat_obat_inap').where({ IDRIWAYATOBAT: id }).first();
};

export const getByRawatInapId = async (idRawatInap) => {
  return await db('riwayat_obat_inap').where({ IDRAWATINAP: idRawatInap });
};
