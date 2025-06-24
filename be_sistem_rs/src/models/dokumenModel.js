import db from '../core/config/knex.js';

const DokumenModel = {
  getAll: () => {
    return db('dokumen')
      .leftJoin('pasien', 'dokumen.NIK', 'pasien.NIK') // LEFT JOIN agar tetap muncul meski pasien tidak ditemukan
      .select(
        'dokumen.*',
        'pasien.NIK as NIKPASIEN',
        'pasien.NAMA as NAMALENGKAP'
      );
  },

  getByNIK: (nik) => {
    return db('dokumen').where({ NIK: nik });
  },

  getById: (id) => {
    return db('dokumen').where({ IDDOKUMEN: id }).first();
  },

  create: (data) => {
    return db('dokumen').insert(data);
  },

  update: (id, data) => {
    return db('dokumen').where({ IDDOKUMEN: id }).update(data);
  },

  remove: (id) => {
    return db('dokumen').where({ IDDOKUMEN: id }).del();
  },
};

export default DokumenModel;