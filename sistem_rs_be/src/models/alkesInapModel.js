import db from '../core/config/knex.js';

export const getAll = () =>
  db('alkes_inap')
    .join('rawat_inap', 'alkes_inap.IDRAWATINAP', 'rawat_inap.IDRAWATINAP')
    .join('rawat_jalan', 'rawat_inap.IDRAWATJALAN', 'rawat_jalan.IDRAWATJALAN')
    .join('pendaftaran', 'rawat_jalan.IDPENDAFTARAN', 'pendaftaran.IDPENDAFTARAN')
    .join('pasien', 'pendaftaran.NIK', 'pasien.NIK')
    .join('bed', 'rawat_inap.IDBED', 'bed.IDBED')
    .join('alkes', 'alkes_inap.IDALKES', 'alkes.IDALKES')
    .select(
      'alkes_inap.*',
      'pasien.NAMALENGKAP',
      'bed.NOMORBED',
      'alkes.NAMAALKES'
    );


export const getById = (id) =>
  db('alkes_inap')
    .where({ IDALKESINAP: id })
    .first();

export const getByRawatInapId = (idRawatInap) =>
  db('alkes_inap')
    .join('alkes', 'alkes_inap.IDALKES', 'alkes.IDALKES')
    .join('master_tenaga_medis', 'alkes_inap.IDTENAGAMEDIS', 'master_tenaga_medis.IDTENAGAMEDIS')
    .where({ 'alkes_inap.IDRAWATINAP': idRawatInap })
    .select(
      'alkes_inap.*',
      'alkes.NAMAALKES',
      'alkes.HARGAJUAL as HARGA_ALKES',
      'master_tenaga_medis.NAMALENGKAP as NAMATENAGAMEDIS'
    );

export const create = (data) =>
  db('alkes_inap').insert(data);

export const remove = (id) =>
  db('alkes_inap').where({ IDALKESINAP: id }).delete();