// src/models/jadwalDokterModel.js
import db from '../core/config/knex.js';

export const getAll = () =>
    db('jadwal_dokter').select();

export const getById = (id) =>
    db('jadwal_dokter').where({ IDJADWAL: id }).first();

export const create = (data) =>
    db('jadwal_dokter').insert(data);

export const update = (id, data) =>
    db('jadwal_dokter')
        .where({ IDJADWAL: id })
        .update({ ...data, UPDATED_AT: db.fn.now() });

export const remove = (id) =>
    db('jadwal_dokter').where({ IDJADWAL: id }).del();
