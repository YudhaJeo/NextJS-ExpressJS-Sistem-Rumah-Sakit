import db from '../core/config/knex.js';

export const findAllAntrianPoli = () => {
  return db('antrian_poli')
    .join('poli', 'antrian_poli.POLI_ID', 'poli.IDPOLI')
    .select('antrian_poli.*', 'poli.NAMAPOLI as POLI');
};

export const findAntrianPoliById = (id) => {
  return db('antrian_poli').where({ ID: id }).first();
};

export const createAntrianPoli = (data) => {
  return db('antrian_poli').insert(data);
};

export const updateStatusAntrianPoli = async (id) => {
  const panggil = await db('antrian_poli').where({ ID: id }).first();

  if (!panggil) {
    throw new Error('Antrian poli tidak ditemukan');
  }

  await db('antrian_poli')
    .where({ POLI_ID: panggil.POLI_ID, STATUS: 'Dipanggil' })
    .update({ STATUS: 'Sudah' });

  await db('antrian_poli')
    .where({ ID: id })
    .update({ STATUS: 'Dipanggil' });

  return true;
};
