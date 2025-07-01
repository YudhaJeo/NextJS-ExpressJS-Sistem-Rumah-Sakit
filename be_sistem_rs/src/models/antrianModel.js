import db from '../core/config/knex.js';

export const findAllAntrian = () => {
  return db('antrian')
    .join('loket', 'antrian.LOKET_ID', 'loket.NO')
    .select('antrian.*', 'loket.NAMALOKET as LOKET');
};

export const findAntrianById = (id) => {
  return db('antrian').where({ ID: id }).first();
};

export const createAntrian = (data) => {
  return db('antrian').insert(data);
};

export const updateStatusAntrian = async (id) => {
  const panggil = await db('antrian').where({ ID: id }).first();

  if (!panggil) {
    throw new Error('Antrian tidak ditemukan');
  }

  await db('antrian')
    .where('LOKET_ID', panggil.LOKET_ID)
    .update({ STATUS: 'Sudah' });

  await db('antrian')
    .where({ ID: id })
    .update({ STATUS: 'Dipanggil' });

  return true;
};

export const deleteAntrian = (id) => {
  return db('antrian').where({ ID: id }).del();
};