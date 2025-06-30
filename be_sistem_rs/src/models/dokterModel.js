// models/dokterModel.js
import db from '../core/config/knex.js';

export const getAllDokter = () => {
    return db('nama_dokter').select('*');
};

export const getDokterById = (id) => {
    return db('nama_dokter').where('IDDOKTER', id).first();
};

export const createDokter = (data) => {
    return db('nama_dokter').insert(data);
};

export const updateDokter = (id, data) => {
    return db('nama_dokter').where('IDDOKTER', id).update(data);
};

export const deleteDokter = (id) => {
    return db('nama_dokter').where('IDDOKTER', id).del();
};
