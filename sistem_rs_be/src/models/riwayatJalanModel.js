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

export async function insertFromRawatJalan(rawatJalan) {
  const {
    IDRAWATJALAN,
    IDDOKTER,
    DIAGNOSA,
    TANGGALRAWAT
  } = rawatJalan;

  const tindakanJalan = await db('tindakan_jalan').where({ IDRAWATJALAN });

  const TOTALTINDAKAN = tindakanJalan.length;
  const TOTALBIAYA = tindakanJalan.reduce((sum, t) => sum + Number(t.TOTAL || 0), 0);

  const [insertedRiwayat] = await db('riwayat_rawat_jalan').insert({
    IDRAWATJALAN,
    IDDOKTER,
    DIAGNOSA,
    TOTALTINDAKAN,
    TOTALBIAYA,
    TANGGALRAWAT
  });

  const pasienData = await db('rawat_jalan')
    .join('pendaftaran', 'rawat_jalan.IDPENDAFTARAN', 'pendaftaran.IDPENDAFTARAN')
    .select('pendaftaran.NIK')
    .where('rawat_jalan.IDRAWATJALAN', IDRAWATJALAN)
    .first();
  
  const IDRIWAYATJALAN = insertedRiwayat ?? await db('riwayat_rawat_jalan')
    .where({ IDRAWATJALAN })
    .select('IDRIWAYATJALAN')
    .first()
    .then((row) => row?.IDRIWAYATJALAN);

  if (pasienData?.NIK && IDRIWAYATJALAN) {
    await db('invoice')
      .where({ NIK: pasienData.NIK })
      .whereNull('IDRIWAYATINAP')
      .update({ IDRIWAYATJALAN });
  }

  if (tindakanJalan.length > 0) {
    const tindakanRiwayat = tindakanJalan.map((t) => ({
      IDRIWAYATJALAN,
      IDTINDAKAN: t.IDTINDAKAN,
      JUMLAH: t.JUMLAH,
      HARGA: t.HARGA,
      TOTAL: t.TOTAL,
    }));
    await db('riwayat_tindakan_jalan').insert(tindakanRiwayat);
  }

  // 🔥 Tambahan: update invoice dengan TOTALTAGIHAN, SISA_TAGIHAN, STATUS
  if (pasienData?.NIK) {
    const invoice = await db('invoice')
      .where('NIK', pasienData.NIK)
      .orderBy('IDINVOICE', 'desc')
      .first();

    if (invoice) {
      const SISA_TAGIHAN = (TOTALBIAYA || 0) - (invoice.TOTALDEPOSIT || 0) - (invoice.TOTALANGSURAN || 0);
      const statusFinal = SISA_TAGIHAN <= 0 ? 'LUNAS' : 'BELUM_LUNAS';

      await db('invoice')
        .where('IDINVOICE', invoice.IDINVOICE)
        .update({
          TOTALTAGIHAN: TOTALBIAYA,
          SISA_TAGIHAN,
          STATUS: statusFinal,
          UPDATED_AT: db.fn.now()
        });
    }
  }

  return IDRIWAYATJALAN;
}

export async function getRiwayatTindakanByIdRiwayat(id) {
  return await db('riwayat_tindakan_jalan')
    .join('tindakan_medis', 'riwayat_tindakan_jalan.IDTINDAKAN', 'tindakan_medis.IDTINDAKAN')
    .select(
      'tindakan_medis.NAMATINDAKAN',
      'tindakan_medis.KATEGORI',
      'riwayat_tindakan_jalan.JUMLAH',
      'riwayat_tindakan_jalan.HARGA',
      'riwayat_tindakan_jalan.TOTAL'
    )
    .where('riwayat_tindakan_jalan.IDRIWAYATJALAN', id);
}
