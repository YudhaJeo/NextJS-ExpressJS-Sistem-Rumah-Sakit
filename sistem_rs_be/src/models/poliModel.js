import db from '../core/config/knex.js';

export const getAll = () => {
    return db('poli').select('*');
};

export const getById = (id) => {
    return db('poli').where('IDPOLI', id).first();
};

export const create = (data) => {
    return db('poli').insert(data);
};

export const update = (id, data) => {
    return db('poli').where('IDPOLI', id).update(data);
};

export const remove = (id) => {
    return db('poli').where('IDPOLI', id).del();
};