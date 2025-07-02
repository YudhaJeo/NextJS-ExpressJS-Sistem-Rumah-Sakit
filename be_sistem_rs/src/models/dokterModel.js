import db from '../core/config/knex.js';

export const getAllDokter = () => {
    return db('nama_dokter as d')
        .join('poli as p', 'd.IDPOLI', 'p.IDPOLI')
        .select(
            'd.IDDOKTER',
            'd.NAMADOKTER',
            'd.IDPOLI',
            'p.NAMAPOLI',
            'd.HARI_PRAKTEK',
            'd.JAM_PRAKTEK'
        );
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
