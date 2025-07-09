// src\models\bangsalModel.js
import db from '../core/config/knex.js';

export const getAll = () => {
    return db('bangsal')
            .join('jenis_bangsal', 'bangsal.IDJENISBANGSAL', 'jenis_bangsal.IDJENISBANGSAL')
            .select(
                'bangsal.*',
                'jenis_bangsal.NAMAJENIS'
            );
};

