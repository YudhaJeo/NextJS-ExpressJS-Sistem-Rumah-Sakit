// src\models\rawatInapModel.js
import db from '../core/config/knex.js';

export const getAll = () =>
    db('rawat_inap')
      .join('pasien', 'rawat_inap.IDPASIEN', 'pasien.IDPASIEN')
      .join('bed', 'rawat_inap.IDBED', 'bed.IDBED')
      .select(
        'rawat_inap.*',
        'pasien.NAMALENGKAP',
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

export const updateBedStatus = (id, status) =>
  db('bed').where({ IDBED: id }).update({ STATUS: status });