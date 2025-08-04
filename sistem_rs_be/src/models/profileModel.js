import db from '../core/config/knex.js';

export const getById = async (id, sumber) => {
  if (sumber === 'medis') {
    const row = await db('master_tenaga_medis')
      .where({ IDTENAGAMEDIS: id })
      .select('*')
      .first();

    if (row) {
      return row;
    }
  }

  if (sumber === 'non_medis') {
    const row = await db('master_tenaga_non_medis')
      .where({ IDTENAGANONMEDIS: id })
      .select('*')
      .first();

    if (row) {
      return row;
    }
  }

  return null;
};

export const updateProfile = async (id, sumber, data) => {
  const baseData = {
    NAMALENGKAP: data.NAMALENGKAP,
    EMAIL: data.EMAIL,
    NOHP: data.NOHP
  };

  if (data.FOTOPROFIL) {
    baseData.FOTOPROFIL = data.FOTOPROFIL;
  }

  if (sumber === 'medis') {
    return db('master_tenaga_medis')
      .where({ IDTENAGAMEDIS: id })
      .update(baseData);
  }

  if (sumber === 'non_medis') {
    return db('master_tenaga_non_medis')
      .where({ IDTENAGANONMEDIS: id })
      .update(baseData);
  }
};
