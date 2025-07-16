// src\models\rawatInapModel.js
import db from '../core/config/knex.js';

export const getAll = () =>
    db('rawat_inap')
      .join('pasien', 'rawat_inap.IDPASIEN', 'pasien.IDPASIEN')
      .join('kamar', 'rawat_inap.IDKAMAR', 'kamar.IDKAMAR')
      .join('bed', 'rawat_inap.IDBED', 'bed.IDBED')
      .select(
        'rawat_inap.*',
        'pasien.NAMALENGKAP',
        'kamar.NAMAKAMAR',
        'bed.NOMORBED'
      );
  

export const getById = (id) =>
  db('rawat_inap').where({ IDRAWATINAP: id }).first();

export const create = (data) =>
  db('rawat_inap').insert(data);

export const update = (id, data) =>
  db('rawat_inap')
    .where({ IDRAWATINAP: id })
    .update({ ...data, UPDATED_AT: db.fn.now() });

export const remove = (id) =>
  db('rawat_inap').where({ IDRAWATINAP: id }).delete();
