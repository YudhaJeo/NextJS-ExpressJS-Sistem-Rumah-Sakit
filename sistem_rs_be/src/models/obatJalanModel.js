import db from '../core/config/knex.js';

export const getAll = () =>
  db('obat_jalan')
    .join('rawat_jalan', 'obat_jalan.IDRAWATJALAN', 'rawat_jalan.IDRAWATJALAN')
    .join('pendaftaran', 'rawat_jalan.IDPENDAFTARAN', 'pendaftaran.IDPENDAFTARAN')
    .join('pasien', 'pendaftaran.NIK', 'pasien.NIK')                                                                                                                                                                                                  
    .join('obat', 'obat_jalan.IDOBAT', 'obat.IDOBAT')
    .select(
      'obat_jalan.*',
      'pasien.NAMALENGKAP',
      'obat.NAMAOBAT'
    );


export const getById = (id) =>
  db('obat_jalan')
    .where({ IDOBATJALAN: id })
    .first();

export const getByRawatJalanId = (idRawatJalan) =>
  db('obat_jalan')
    .where({ IDRAWATJALAN: idRawatJalan });

export const create = (data) =>
  db('obat_jalan').insert(data);

export const update = (id, data) =>
  db('obat_jalan')
    .where({ IDOBATJALAN: id })
    .update({ ...data, UPDATED_AT: db.fn.now() });

export const remove = (id) =>
  db('obat_jalan').where({ IDOBATJALAN: id }).delete();