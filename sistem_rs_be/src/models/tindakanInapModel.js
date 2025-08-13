import db from '../core/config/knex.js';

export const getAll = () =>
  db('tindakan_inap')
    .join('rawat_inap', 'tindakan_inap.IDRAWATINAP', 'rawat_inap.IDRAWATINAP')
    .join('rawat_jalan', 'rawat_inap.IDRAWATJALAN', 'rawat_jalan.IDRAWATJALAN')
    .join('pendaftaran', 'rawat_jalan.IDPENDAFTARAN', 'pendaftaran.IDPENDAFTARAN')
    .join('pasien', 'pendaftaran.NIK', 'pasien.NIK')
    .join('bed', 'rawat_inap.IDBED', 'bed.IDBED')
    .join('tindakan_medis', 'tindakan_inap.IDTINDAKAN', 'tindakan_medis.IDTINDAKAN')
    .select(
      'tindakan_inap.*',
      'pasien.NAMALENGKAP',
      'bed.NOMORBED',
      'tindakan_medis.NAMATINDAKAN'
    );

export const getById = (id) =>
  db('tindakan_inap')
    .where({ IDTINDAKANINAP: id })
    .first();

export const getByRawatInapId = (idRawatInap) =>
  db('tindakan_inap')
    .join('tindakan_medis', 'tindakan_inap.IDTINDAKAN', 'tindakan_medis.IDTINDAKAN')
    .where({ 'tindakan_inap.IDRAWATINAP': idRawatInap })
    .select(
      'tindakan_inap.*',
      'tindakan_medis.NAMATINDAKAN',
      'tindakan_medis.HARGA as HARGA_TINDAKAN'
    );

export const create = (data) =>
  db('tindakan_inap').insert(data);

export const remove = (id) =>
  db('tindakan_inap').where({ IDTINDAKANINAP: id }).delete();
