import db from '../core/config/knex.js'

export const insert = async (data) => {
  const result = await db('riwayat_tindakan_inap').insert(data)
  const id = result[0]

  return await db('riwayat_tindakan_inap')
    .where({ IDRIWAYATTINDAKAN: id })
    .first()
}

export const getAll = async () => {
  return await db('riwayat_tindakan_inap')
}

export const getById = async (id) => {
  return await db('riwayat_tindakan_inap').where({ IDRIWAYATTINDAKAN: id }).first()
}

export const getByRawatInapId = async (idRawatInap) => {
  return await db('riwayat_tindakan_inap').where({ IDRAWATINAP: idRawatInap })
}
