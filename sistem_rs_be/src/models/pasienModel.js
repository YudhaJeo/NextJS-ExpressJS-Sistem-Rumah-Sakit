import db from '../core/config/knex.js';

export const getAll = () => {
  return db('pasien')
    .join('agama', 'pasien.IDAGAMA', 'agama.IDAGAMA')
    .join('asuransi', 'pasien.IDASURANSI', 'asuransi.IDASURANSI')
    .select(
      'pasien.*',
      'agama.NAMAAGAMA',
      'asuransi.NAMAASURANSI'
    );
};

export const getById = (id) => {
  return db('pasien').where({ IDPASIEN: id }).first();
};

export async function getByNIK(nik) {
  return db('pasien').where({ NIK: nik }).first();
}

export const create = (data) => {
  return db('pasien').insert(data);
};

export const update = (id, data) => {
  return db('pasien').where({ IDPASIEN: id }).update(data);
};

export const remove = (id) => {
  return db('pasien').where({ IDPASIEN: id }).del();
};