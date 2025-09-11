import db from '../core/config/knex.js';

export async function getRiwayatKunjungan() {
  const data = await db('riwayat_kunjungan as rk')
    .join('pasien as ps', 'rk.NIK', 'ps.NIK')
    .select(
      'ps.NOREKAMMEDIS',
      'ps.NIK',
      'ps.NAMALENGKAP',
      db.raw('MAX(rk.TANGGAL) as TANGGAL')
    )
    .groupBy('ps.NIK', 'ps.NAMALENGKAP')
    .orderBy('TANGGAL', 'desc');

  return data;
}

export async function getRiwayatByPasien(nik) {
  const data = await db('riwayat_kunjungan as rk')
    .leftJoin('riwayat_rawat_jalan as rj', 'rk.IDRIWAYATJALAN', 'rj.IDRIWAYATJALAN')
    .leftJoin('riwayat_rawat_inap as ri', 'rk.IDRIWAYATINAP', 'ri.IDRIWAYATINAP')
    .select(
      'rk.NIK',
      'rk.JENIS',
      'rk.IDRIWAYATJALAN',
      'rk.IDRIWAYATINAP',
      db.raw("COALESCE(rj.TANGGALRAWAT, ri.TANGGALMASUK, rk.TANGGAL) as TANGGAL")
    )
    .where('rk.NIK', nik)
    .orderBy('TANGGAL', 'desc');

  return data;
}

export async function insertKunjungan({ NIK, JENIS, IDRIWAYATJALAN = null, IDRIWAYATINAP = null }) {
  await db('riwayat_kunjungan').insert({
    NIK,
    JENIS,
    IDRIWAYATJALAN,
    IDRIWAYATINAP,
    TANGGAL: db.fn.now(),
    CREATED_AT: db.fn.now()
  });
}