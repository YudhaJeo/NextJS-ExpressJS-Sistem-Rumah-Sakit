// src/models/bedModel.js

import db from '../core/config/knex.js'

export const getAll = () => {
    return db('bed')
        .join('kamar', 'bed.IDKAMAR', 'kamar.IDKAMAR')
        .select(
            'bed.*',
            'kamar.NAMAKAMAR'
        );
};

export const getByNomor = (nomorbed) => {
    return db('bed').where({ NOMORBED: nomorbed }).first();
}