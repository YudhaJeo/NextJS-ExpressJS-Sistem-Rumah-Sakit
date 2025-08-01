// sistem_rs_be/src/models/profileModel.js
import db from '../core/config/knex.js';

export const getById = async (id, sumber) => {
  if (sumber === 'medis') {
    const row = await db('master_tenaga_medis')
      .where({ IDTENAGAMEDIS: id })
      .select('*', db.raw('?? as ROLE', ['JENISTENAGAMEDIS']))
      .first();

    if (row) {
      return {
        ...row,
        ID: row.IDTENAGAMEDIS,
        USERNAME: row.NAMALENGKAP,
        EMAIL: row.EMAIL,
        NOHP: row.NOHP
      };
    }
  }

  if (sumber === 'non_medis') {
    const row = await db('master_tenaga_non_medis')
      .where({ IDTENAGANONMEDIS: id })
      .select('*', db.raw('?? as ROLE', ['JENISTENAGANONMEDIS']))
      .first();

    if (row) {
      return {
        ...row,
        ID: row.IDTENAGANONMEDIS,
        USERNAME: row.NAMALENGKAP,
        EMAIL: row.EMAIL,
        NOHP: row.NOHP
      };
    }
  }

  return null;
};

export const updateProfile = async (id, sumber, data) => {
  const baseData = {
    NAMALENGKAP: data.username,
    EMAIL: data.email,
    NOHP: data.nohp
  };

  if (data.fotoprofil) {
    baseData.FOTOPROFIL = data.fotoprofil;
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
