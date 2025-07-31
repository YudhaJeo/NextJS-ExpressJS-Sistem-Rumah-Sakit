// src/models/obatInapModel.js
import db from '../core/config/knex.js';

export const getAll = () =>
  db('obat_inap')
    .join('rawat_inap', 'obat_inap.IDRAWATINAP', 'rawat_inap.IDRAWATINAP')
    .join('riwayat_pengobatan', 'rawat_inap.IDPENGOBATAN', 'riwayat_pengobatan.IDPENGOBATAN')
    .join('pendaftaran', 'riwayat_pengobatan.IDPENDAFTARAN', 'pendaftaran.IDPENDAFTARAN')
    .join('pasien', 'pendaftaran.NIK', 'pasien.NIK')
    .join('bed', 'rawat_inap.IDBED', 'bed.IDBED')
    .join('obat', 'obat_inap.IDOBAT', 'obat.IDOBAT')
    .select(
      'obat_inap.*',
      'pasien.NAMALENGKAP',
      'bed.NOMORBED',
      'obat.NAMAOBAT'
    );


export const getById = (id) =>
  db('obat_inap')
    .where({ IDOBATINAP: id })
    .first();

export const getByRawatInapId = (idRawatInap) =>
  db('obat_inap')
    .where({ IDRAWATINAP: idRawatInap });

export const create = (data) =>
  db('obat_inap').insert(data);

export const update = (id, data) =>
  db('obat_inap')
    .where({ IDOBATINAP: id })
    .update({ ...data, UPDATED_AT: db.fn.now() });

export const remove = (id) =>
  db('obat_inap').where({ IDOBATINAP: id }).delete();