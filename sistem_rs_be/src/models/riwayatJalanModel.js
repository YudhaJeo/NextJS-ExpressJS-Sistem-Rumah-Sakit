// D:\MARSTECH\NextJS-ExpressJS-Final-System\sistem_rs_be\src\models\riwayatJalanModel.js
import db from '../core/config/knex.js';

export async function getAllRiwayatJalan() {
  return await db('riwayat_rawat_jalan')
    .join('rawat_jalan', 'riwayat_rawat_jalan.IDRAWATJALAN', 'rawat_jalan.IDRAWATJALAN')
    .join('pendaftaran', 'rawat_jalan.IDPENDAFTARAN', 'pendaftaran.IDPENDAFTARAN')
    .join('pasien', 'pendaftaran.NIK', 'pasien.NIK')
    .join('poli', 'pendaftaran.IDPOLI', 'poli.IDPOLI')
    .join('dokter', 'riwayat_rawat_jalan.IDDOKTER', 'dokter.IDDOKTER')
    .join('master_tenaga_medis', 'dokter.IDTENAGAMEDIS', 'master_tenaga_medis.IDTENAGAMEDIS')
    .select(
      'riwayat_rawat_jalan.*',
      'pasien.NAMALENGKAP',
      'pasien.NIK',
      'pasien.JENISKELAMIN',
      'pasien.ALAMAT',
      'pendaftaran.TANGGALKUNJUNGAN',
      'pendaftaran.KELUHAN',
      'poli.NAMAPOLI as POLI',
      'master_tenaga_medis.NAMALENGKAP as NAMADOKTER'
    )
    .orderBy('riwayat_rawat_jalan.IDRIWAYATJALAN', 'desc');
}

export async function getRiwayatJalanById(id) {
  return await db('riwayat_rawat_jalan')
    .join('rawat_jalan', 'riwayat_rawat_jalan.IDRAWATJALAN', 'rawat_jalan.IDRAWATJALAN')
    .join('pendaftaran', 'rawat_jalan.IDPENDAFTARAN', 'pendaftaran.IDPENDAFTARAN')
    .join('pasien', 'pendaftaran.NIK', 'pasien.NIK')
    .join('poli', 'pendaftaran.IDPOLI', 'poli.IDPOLI')
    .join('dokter', 'riwayat_rawat_jalan.IDDOKTER', 'dokter.IDDOKTER')
    .join('master_tenaga_medis', 'dokter.IDTENAGAMEDIS', 'master_tenaga_medis.IDTENAGAMEDIS')
    .select(
      'riwayat_rawat_jalan.*',
      'pasien.NAMALENGKAP',
      'pasien.NIK',
      'pasien.JENISKELAMIN',
      'pasien.ALAMAT',
      'pendaftaran.TANGGALKUNJUNGAN',
      'pendaftaran.KELUHAN',
      'poli.NAMAPOLI as POLI',
      'master_tenaga_medis.NAMALENGKAP as NAMADOKTER'
    )
    .where('riwayat_rawat_jalan.IDRIWAYATJALAN', id)
    .first();
}

export async function getRiwayatTindakanByIdRiwayat(id) {
  return await db('riwayat_tindakan_jalan')
    .join('tindakan_medis', 'riwayat_tindakan_jalan.IDTINDAKAN', 'tindakan_medis.IDTINDAKAN')
    .select('tindakan_medis.NAMATINDAKAN', 'tindakan_medis.KATEGORI', 'riwayat_tindakan_jalan.JUMLAH', 'riwayat_tindakan_jalan.HARGA', 'riwayat_tindakan_jalan.TOTAL')
    .where('riwayat_tindakan_jalan.IDRIWAYATJALAN', id);
}

export async function insertFromRawatJalan(rawatJalan) {
  const {
    IDRAWATJALAN,
    IDDOKTER,
    DIAGNOSA,
    TOTALTINDAKAN,
    TOTALBIAYA,
    TANGGALRAWAT
  } = rawatJalan;

  const [insertedRiwayat] = await db('riwayat_rawat_jalan').insert({
    IDRAWATJALAN,
    IDDOKTER,
    DIAGNOSA,
    TOTALTINDAKAN,
    TOTALBIAYA,
    TANGGALRAWAT
  });

  const IDRIWAYATJALAN = insertedRiwayat ?? await db('riwayat_rawat_jalan')
    .where({ IDRAWATJALAN })
    .select('IDRIWAYATJALAN')
    .first()
    .then((row) => row?.IDRIWAYATJALAN);

  const tindakanJalan = await db('tindakan_jalan').where({ IDRAWATJALAN });

  if (tindakanJalan.length > 0) {
    const tindakanRiwayat = tindakanJalan.map((tindakan) => ({
      IDRIWAYATJALAN,
      IDTINDAKAN: tindakan.IDTINDAKAN,
      JUMLAH: tindakan.JUMLAH,
      HARGA: tindakan.HARGA,
      TOTAL: tindakan.TOTAL,
    }));
    await db('riwayat_tindakan_jalan').insert(tindakanRiwayat);
  }
}