import db from '../core/config/knex.js';

export const getAllKomisi = () =>
  db('komisi_dokter')
    .join('rawat_jalan', 'komisi_dokter.IDRAWATJALAN', 'rawat_jalan.IDRAWATJALAN')
    .join('pendaftaran', 'rawat_jalan.IDPENDAFTARAN', 'pendaftaran.IDPENDAFTARAN')
    .join('dokter', 'rawat_jalan.IDDOKTER', 'dokter.IDDOKTER')
    .join('pasien', 'pendaftaran.NIK', 'pasien.NIK')
    .join('master_tenaga_medis', 'dokter.IDTENAGAMEDIS', 'master_tenaga_medis.IDTENAGAMEDIS')
    .select(
      'komisi_dokter.*',
      'pendaftaran.NIK',
      'pendaftaran.TANGGALKUNJUNGAN',
      'pendaftaran.KELUHAN',
      'rawat_jalan.DIAGNOSA',
      'rawat_jalan.OBAT',
      'pasien.NAMALENGKAP as NAMAPASIEN',
      'master_tenaga_medis.NAMALENGKAP as NAMADOKTER'
    );

export const getByIdKomisi = (id) =>
  db('komisi_dokter')
    .join('rawat_jalan', 'komisi_dokter.IDRAWATJALAN', 'rawat_jalan.IDRAWATJALAN')
    .join('pendaftaran', 'rawat_jalan.IDPENDAFTARAN', 'pendaftaran.IDPENDAFTARAN')
    .join('dokter', 'rawat_jalan.IDDOKTER', 'dokter.IDDOKTER')
    .join('pasien', 'pendaftaran.NIK', 'pasien.NIK')
    .join('master_tenaga_medis', 'dokter.IDTENAGAMEDIS', 'master_tenaga_medis.IDTENAGAMEDIS')
    .select(
      'komisi_dokter.*',
      'pendaftaran.NIK',
      'pendaftaran.TANGGALKUNJUNGAN',
      'pendaftaran.KELUHAN',
      'rawat_jalan.DIAGNOSA',
      'rawat_jalan.OBAT',
      'pasien.NAMALENGKAP as NAMAPASIEN',
      'master_tenaga_medis.NAMALENGKAP as NAMADOKTER'
    )
    .where('komisi_dokter.IDKOMISI', id)
    .first();

export const createKomisi = (data) =>
  db('komisi_dokter').insert(data);

export const updateKomisi = (id, data) =>
  db('komisi_dokter').where({ IDKOMISI: id }).update(data);

export const removeKomisi = (id) =>
  db('komisi_dokter').where({ IDKOMISI: id }).del();
