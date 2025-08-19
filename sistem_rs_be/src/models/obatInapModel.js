import db from '../core/config/knex.js';

export const getAll = () =>
  db('obat_inap')
    .join('rawat_inap', 'obat_inap.IDRAWATINAP', 'rawat_inap.IDRAWATINAP')
    .join('rawat_jalan', 'rawat_inap.IDRAWATJALAN', 'rawat_jalan.IDRAWATJALAN')
    .join('pendaftaran', 'rawat_jalan.IDPENDAFTARAN', 'pendaftaran.IDPENDAFTARAN')
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
    .join('obat', 'obat_inap.IDOBAT', 'obat.IDOBAT')
    .join('master_tenaga_medis', 'obat_inap.IDTENAGAMEDIS', 'master_tenaga_medis.IDTENAGAMEDIS')
    .where({ 'obat_inap.IDRAWATINAP': idRawatInap })
    .select(
      'obat_inap.*',
      'obat.NAMAOBAT',
      'obat.HARGAJUAL as HARGA_OBAT',
      'master_tenaga_medis.NAMALENGKAP as NAMATENAGAMEDIS'
    );

export const create = (data) =>
  db('obat_inap').insert(data);

export const remove = (id) =>
  db('obat_inap').where({ IDOBATINAP: id }).delete();