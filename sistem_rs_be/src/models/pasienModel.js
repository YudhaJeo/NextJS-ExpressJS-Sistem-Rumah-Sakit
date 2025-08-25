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

async function generateNoRM() {
  const last = await db('pasien')
    .max('NOREKAMMEDIS as maxNo')
    .first();

  let nextNo = 1;

  if (last && last.maxNo) {
    nextNo = parseInt(last.maxNo, 10) + 1; 
  }
  return String(nextNo).padStart(8, '0');
}

export const getById = (id) => {
  return db('pasien').where({ IDPASIEN: id }).first();
};

export async function getByNIK(nik) {
  return db('pasien').where({ NIK: nik }).first();
}

export const create = async (data) => {
  const noRM = await generateNoRM();
  return db('pasien').insert({ ...data, NOREKAMMEDIS: noRM });
};

export const update = (id, data) => {
  return db('pasien').where({ IDPASIEN: id }).update(data);
};

export const remove = (id) => {
  return db('pasien').where({ IDPASIEN: id }).del();
};