import db from '../core/config/knex.js';

export const getAll = () =>
    db('tindakan_medis').select();

export const getById = (id) =>
    db('tindakan_medis').where({ IDTINDAKAN: id }).first();

export const createTindakan = (data) =>
    db('tindakan_medis').insert(data);

export const updateTindakan = (id, data) =>
    db('tindakan_medis')
        .where({ IDTINDAKAN: id })
        .update({
            ...data,
            UPDATED_AT: db.fn.now(),
        });

export const remove = (id) =>
    db('tindakan_medis').where({ IDTINDAKAN: id }).delete();
