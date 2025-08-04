import db from '../core/config/knex.js';

export const getAll = () => {
    return db('master_supplier').select('*');
};

export const getById = (id) => {
    return db('master_supplier').where('SUPPLIERID', id).first();
};

export const create = (data) => {
    return db('master_supplier').insert(data);
};

export const update = (id, data) => {
    return db('master_supplier').where('SUPPLIERID', id).update(data);
};

export const remove = (id) => {
    return db('master_supplier').where('SUPPLIERID', id).del();
};