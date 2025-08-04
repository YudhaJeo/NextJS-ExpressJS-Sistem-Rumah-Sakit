import db from '../core/config/knex.js';

export const getAll = () =>
  db('tindakan_inap')
    .join('rawat_inap', 'tindakan_inap.IDRAWATINAP', 'rawat_inap.IDRAWATINAP')
    .join('riwayat_pengobatan', 'rawat_inap.IDPENGOBATAN', 'riwayat_pengobatan.IDPENGOBATAN')
    .join('pendaftaran', 'riwayat_pengobatan.IDPENDAFTARAN', 'pendaftaran.IDPENDAFTARAN')
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
    .where({ IDRAWATINAP: idRawatInap });

export const create = (data) =>
  db('tindakan_inap').insert(data);

export const update = (id, data) =>
  db('tindakan_inap')
    .where({ IDTINDAKANINAP: id })
    .update({ ...data, UPDATED_AT: db.fn.now() });

export const remove = (id) =>
  db('tindakan_inap').where({ IDTINDAKANINAP: id }).delete();
