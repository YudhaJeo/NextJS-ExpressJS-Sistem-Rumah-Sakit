// src/models/authModel.js
import db from '../core/config/knex.js';

export const findUserByEmail = async (email) => {
  const tenagaMedis = await db('master_tenaga_medis')
    .where({ EMAIL: email, STATUSAKTIF: 1 })
    .first()
    .select('*', db.raw('?? as ROLE', ['JENISTENAGAMEDIS']))

  if (tenagaMedis) return {
    ...tenagaMedis,
    ID: tenagaMedis.IDTENAGAMEDIS,
    USERNAME: tenagaMedis.NAMALENGKAP,
  };

  const tenagaNonMedis = await db('master_tenaga_non_medis')
    .where({ EMAIL: email, STATUSAKTIF: 1 })
    .first()
    .select('*', db.raw('?? as ROLE', ['JENISTENAGANONMEDIS']))

    if (tenagaNonMedis) return {
  ...tenagaNonMedis,
  ID: tenagaNonMedis.IDTENAGANONMEDIS,
  USERNAME: tenagaNonMedis.NAMALENGKAP,
};
};