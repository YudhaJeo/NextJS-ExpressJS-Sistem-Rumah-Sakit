// src/models/riwayatInapModel.js
import db from '../core/config/knex.js';

export async function getRiwayatInap() {
  return await db('rawat_inap')
    .select(
      'rawat_inap.IDRAWATINAP',
      'rawat_inap.TANGGALMASUK',
      'rawat_inap.TANGGALKELUAR',
      'pasien.NAMALENGKAP',
      'bed.NOMORBED',
      db.raw('IFNULL(SUM(DISTINCT rawat_inap.TOTAL_HARGA_KAMAR), 0) as TOTALKAMAR'),
      db.raw('IFNULL(SUM(obat_inap.TOTAL), 0) as TOTALOBAT'),
      db.raw('IFNULL(SUM(tindakan_inap.TOTAL), 0) as TOTALTINDAKAN'),
      db.raw('IFNULL(SUM(obat_inap.TOTAL), 0) + IFNULL(SUM(tindakan_inap.TOTAL), 0) + IFNULL(SUM(DISTINCT rawat_inap.TOTAL_HARGA_KAMAR), 0) as TOTALBIAYA')
    )
    .leftJoin('pasien', 'rawat_inap.IDPASIEN', 'pasien.IDPASIEN')
    .leftJoin('bed', 'rawat_inap.IDBED', 'bed.IDBED')
    .leftJoin('obat_inap', 'rawat_inap.IDRAWATINAP', 'obat_inap.IDRAWATINAP')
    .leftJoin('tindakan_inap', 'rawat_inap.IDRAWATINAP', 'tindakan_inap.IDRAWATINAP')
    .where('rawat_inap.STATUS', 'SELESAI')
    .groupBy('rawat_inap.IDRAWATINAP', 'pasien.NAMALENGKAP', 'bed.NOMORBED', 'rawat_inap.TOTAL_HARGA_KAMAR')
    .orderBy('rawat_inap.IDRAWATINAP', 'desc');
}

export async function getRiwayatInapById(id) {
  return await db('rawat_inap')
    .select(
      'rawat_inap.IDRAWATINAP',
      'rawat_inap.TANGGALMASUK',
      'rawat_inap.TANGGALKELUAR',
      'pasien.NAMALENGKAP',
      'bed.NOMORBED',
      db.raw('IFNULL(rawat_inap.TOTAL_HARGA_KAMAR, 0) as TOTALKAMAR'),
      db.raw('IFNULL(SUM(obat_inap.TOTAL), 0) as TOTALOBAT'),
      db.raw('IFNULL(SUM(tindakan_inap.TOTAL), 0) as TOTALTINDAKAN'),
      db.raw('IFNULL(SUM(obat_inap.TOTAL), 0) + IFNULL(SUM(tindakan_inap.TOTAL), 0) + IFNULL(rawat_inap.TOTAL_HARGA_KAMAR, 0) as TOTALBIAYA')
    )
    .leftJoin('pasien', 'rawat_inap.IDPASIEN', 'pasien.IDPASIEN')
    .leftJoin('bed', 'rawat_inap.IDBED', 'bed.IDBED')
    .leftJoin('obat_inap', 'rawat_inap.IDRAWATINAP', 'obat_inap.IDRAWATINAP')
    .leftJoin('tindakan_inap', 'rawat_inap.IDRAWATINAP', 'tindakan_inap.IDRAWATINAP')
    .where('rawat_inap.IDRAWATINAP', id)
    .groupBy('rawat_inap.IDRAWATINAP', 'pasien.NAMALENGKAP', 'bed.NOMORBED', 'rawat_inap.TOTAL_HARGA_KAMAR')
    .first();
}

export async function getObatInapByIdRawatInap(id) {
  return await db('obat_inap')
    .select(
      'obat_inap.IDOBATINAP',
      'obat.NAMAOBAT',
      'obat.SATUAN',
      'obat_inap.JUMLAH',
      'obat_inap.HARGA',
      'obat_inap.TOTAL'
    )
    .leftJoin('obat', 'obat_inap.IDOBAT', 'obat.IDOBAT')
    .where('obat_inap.IDRAWATINAP', id);
}

export async function getTindakanInapByIdRawatInap(id) {
  return await db('tindakan_inap')
    .select(
      'tindakan_inap.IDTINDAKANINAP',
      'tindakan_medis.NAMATINDAKAN',
      'tindakan_medis.KATEGORI',
      'tindakan_inap.JUMLAH',
      'tindakan_inap.HARGA',
      'tindakan_inap.TOTAL'
    )
    .leftJoin('tindakan_medis', 'tindakan_inap.IDTINDAKAN', 'tindakan_medis.IDTINDAKAN')
    .where('tindakan_inap.IDRAWATINAP', id);
}
