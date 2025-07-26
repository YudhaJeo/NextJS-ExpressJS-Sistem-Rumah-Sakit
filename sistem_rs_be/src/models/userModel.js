import db from '../core/config/knex.js';

export const getById = async (id, sumber) => {
  if (sumber === 'medis') {
    const tenagaMedis = await db('master_tenaga_medis')
      .where({ IDTENAGAMEDIS: id })
      .first()
      .select('*', db.raw('?? as ROLE', ['JENISTENAGAMEDIS']));

    if (tenagaMedis) return {
      ...tenagaMedis,
      ID: tenagaMedis.IDTENAGAMEDIS,
      USERNAME: tenagaMedis.NAMALENGKAP,
      EMAIL: tenagaMedis.EMAIL
    };
  }

  if (sumber === 'non_medis') {
    const tenagaNonMedis = await db('master_tenaga_non_medis')
      .where({ IDTENAGANONMEDIS: id })
      .first()
      .select('*', db.raw('?? as ROLE', ['JENISTENAGANONMEDIS']));

    if (tenagaNonMedis) return {
      ...tenagaNonMedis,
      ID: tenagaNonMedis.IDTENAGANONMEDIS,
      USERNAME: tenagaNonMedis.NAMALENGKAP,
      EMAIL: tenagaNonMedis.EMAIL
    };
  }

  return null;
};

export const updateProfile = async (id, sumber, data) => {
  if (sumber === 'medis') {
    return db('master_tenaga_medis')
      .where({ IDTENAGAMEDIS: id })
      .update({
        NAMALENGKAP: data.username,
        EMAIL: data.email,
      });
  }

  if (sumber === 'non_medis') {
    return db('master_tenaga_non_medis')
      .where({ IDTENAGANONMEDIS: id })
      .update({
        NAMALENGKAP: data.username,
        EMAIL: data.email,
      });
  }
};