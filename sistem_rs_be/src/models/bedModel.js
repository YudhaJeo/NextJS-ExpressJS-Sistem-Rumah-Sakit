import db from '../core/config/knex.js'

export const getAll = () => {
  return db('bed')
    .join('kamar', 'bed.IDKAMAR', '=', 'kamar.IDKAMAR')
    .join('bangsal', 'kamar.IDBANGSAL', '=', 'bangsal.IDBANGSAL')
    .join('jenis_bangsal', 'bangsal.IDJENISBANGSAL', 'jenis_bangsal.IDJENISBANGSAL')
    .select(
      'bed.*',
      'kamar.NAMAKAMAR',
      'bangsal.NAMABANGSAL',
      'jenis_bangsal.HARGAPERHARI',
    );
};

export const getByNomor = (nomorbed) => {
  return db('bed').where({ NOMORBED: nomorbed }).first();
}

export const create = (data) => {
  return db('bed').insert(data);
};

export const update = (id, data) => {
  return db('bed')
    .where({ IDBED: id })
    .update({
      ...data,
      UPDATED_AT: db.fn.now(),
    });
};

export const deleteById = (id) => {
  return db('bed').where({ IDBED: id }).del();
};
