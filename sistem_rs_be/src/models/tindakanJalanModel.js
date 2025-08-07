import db from '../core/config/knex.js';

export const getAll = () =>
  db('tindakan_jalan')
    .join('rawat_jalan', 'tindakan_jalan.IDRAWATJALAN', 'rawat_jalan.IDRAWATJALAN')
    .join('pendaftaran', 'rawat_jalan.IDPENDAFTARAN', 'pendaftaran.IDPENDAFTARAN')
    .join('pasien', 'pendaftaran.NIK', 'pasien.NIK')
    .join('tindakan_medis', 'tindakan_jalan.IDTINDAKAN', 'tindakan_medis.IDTINDAKAN')
    .select(
      'tindakan_jalan.*',
      'pasien.NAMALENGKAP',
      'tindakan_medis.NAMATINDAKAN'
    );

export const getById = (id) =>
  db('tindakan_jalan')
    .where({ IDTINDAKANJALAN: id })
    .first();

export const getByRawatJalanId = (idRawatJalan) =>
  db('tindakan_jalan')
    .where({ IDRAWATJALAN: idRawatJalan });

export const create = (data) =>
  db('tindakan_jalan').insert(data);

export const update = (id, data) =>
  db('tindakan_jalan')
    .where({ IDTINDAKANJALAN: id })
    .update({ ...data, UPDATED_AT: db.fn.now() });

export const remove = (id) =>
  db('tindakan_jalan').where({ IDTINDAKANJALAN: id }).delete();
