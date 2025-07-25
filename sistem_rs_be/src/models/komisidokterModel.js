import db from '../core/config/knex.js';

export const getAllKomisi = () =>
  db('komisi_dokter')
    .join('riwayat_pengobatan', 'komisi_dokter.IDPENGOBATAN', 'riwayat_pengobatan.IDPENGOBATAN')
    .join('pendaftaran', 'riwayat_pengobatan.IDPENDAFTARAN', 'pendaftaran.IDPENDAFTARAN')
    .join('pasien', 'riwayat_pengobatan.NIK', 'pasien.NIK')
    .join('dokter', 'riwayat_pengobatan.IDDOKTER', 'dokter.IDDOKTER')
    .join('master_tenaga_medis', 'dokter.IDTENAGAMEDIS', 'master_tenaga_medis.IDTENAGAMEDIS')
    .select(
      'komisi_dokter.*',
      'riwayat_pengobatan.TANGGALKUNJUNGAN',
      'riwayat_pengobatan.KELUHAN',
      'riwayat_pengobatan.DIAGNOSA',
      'riwayat_pengobatan.OBAT',
      'pasien.NIK',
      'pasien.NAMALENGKAP as NAMAPASIEN',
      'master_tenaga_medis.NAMALENGKAP as NAMADOKTER'
    );

export const getByIdKomisi = (id) =>
  db('komisi_dokter')
    .join('riwayat_pengobatan', 'komisi_dokter.IDPENGOBATAN', 'riwayat_pengobatan.IDPENGOBATAN')
    .join('pendaftaran', 'riwayat_pengobatan.IDPENDAFTARAN', 'pendaftaran.IDPENDAFTARAN')
    .join('pasien', 'riwayat_pengobatan.NIK', 'pasien.NIK')
    .join('dokter', 'riwayat_pengobatan.IDDOKTER', 'dokter.IDDOKTER')
    .join('master_tenaga_medis', 'dokter.IDTENAGAMEDIS', 'master_tenaga_medis.IDTENAGAMEDIS')
    .select(
      'komisi_dokter.*',
      'riwayat_pengobatan.TANGGALKUNJUNGAN',
      'riwayat_pengobatan.KELUHAN',
      'riwayat_pengobatan.DIAGNOSA',
      'riwayat_pengobatan.OBAT',
      'pasien.NIK',
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
