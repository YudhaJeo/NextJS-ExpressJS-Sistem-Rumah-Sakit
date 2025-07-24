import db from '../core/config/knex.js';

export async function getAllRiwayatInap() {
  return await db('riwayat_rawat_inap')
    .join('rawat_inap', 'riwayat_rawat_inap.IDRAWATINAP', 'rawat_inap.IDRAWATINAP')
    .join('pasien', 'rawat_inap.IDPASIEN', 'pasien.IDPASIEN')
    .join('bed', 'rawat_inap.IDBED', 'bed.IDBED')
    .select(
      'riwayat_rawat_inap.IDRIWAYATINAP',
      'riwayat_rawat_inap.IDRAWATINAP',
      'riwayat_rawat_inap.TANGGALMASUK',
      'riwayat_rawat_inap.TANGGALKELUAR',
      'pasien.NAMALENGKAP',
      'bed.NOMORBED',
      'riwayat_rawat_inap.TOTAL_HARGA_KAMAR',
      'riwayat_rawat_inap.TOTALOBAT',
      'riwayat_rawat_inap.TOTALTINDAKAN',
      'riwayat_rawat_inap.TOTALBIAYA',
      'riwayat_rawat_inap.STATUS',
      'riwayat_rawat_inap.CATATAN'
    )    
    .orderBy('riwayat_rawat_inap.IDRIWAYATINAP', 'desc');
}

export async function getRiwayatInapById(id) {
  return await db('riwayat_rawat_inap')
    .join('rawat_inap', 'riwayat_rawat_inap.IDRAWATINAP', 'rawat_inap.IDRAWATINAP')
    .join('pasien', 'rawat_inap.IDPASIEN', 'pasien.IDPASIEN')
    .join('bed', 'rawat_inap.IDBED', 'bed.IDBED')
    .select(
      'riwayat_rawat_inap.*',
      'pasien.NAMALENGKAP',
      'bed.NOMORBED',
      'riwayat_rawat_inap.TOTAL_HARGA_KAMAR'
    )
    .where('riwayat_rawat_inap.IDRIWAYATINAP', id)
    .first();
}

export async function getRiwayatObatByIdRiwayat(id) {
  return await db('riwayat_obat_inap')
    .join('obat', 'riwayat_obat_inap.IDOBAT', 'obat.IDOBAT')
    .select('obat.NAMAOBAT', 'obat.SATUAN', 'riwayat_obat_inap.JUMLAH', 'riwayat_obat_inap.HARGA', 'riwayat_obat_inap.TOTAL')
    .where('riwayat_obat_inap.IDRIWAYATINAP', id);
}

export async function getRiwayatTindakanByIdRiwayat(id) {
  return await db('riwayat_tindakan_inap')
    .join('tindakan_medis', 'riwayat_tindakan_inap.IDTINDAKAN', 'tindakan_medis.IDTINDAKAN')
    .select('tindakan_medis.NAMATINDAKAN', 'tindakan_medis.KATEGORI', 'riwayat_tindakan_inap.JUMLAH', 'riwayat_tindakan_inap.HARGA', 'riwayat_tindakan_inap.TOTAL')
    .where('riwayat_tindakan_inap.IDRIWAYATINAP', id);
}

export async function insertFromRawatInap(rawatInap) {
  const {
    IDRAWATINAP,
    TANGGALMASUK,
    TANGGALKELUAR,
    STATUS,
    TOTAL_HARGA_KAMAR,
    CATATAN
  } = rawatInap;

  // ambil total dari tabel obat_inap dan tindakan_inap
  const obat = await db('obat_inap').where({ IDRAWATINAP }).sum('TOTAL as total').first();
  const tindakan = await db('tindakan_inap').where({ IDRAWATINAP }).sum('TOTAL as total').first();

  const TOTALOBAT = Number(obat.total) || 0;
  const TOTALTINDAKAN = Number(tindakan.total) || 0;
  const TOTALBIAYA = (TOTAL_HARGA_KAMAR || 0) + TOTALOBAT + TOTALTINDAKAN;

  return await db('riwayat_rawat_inap').insert({
    IDRAWATINAP,
    TANGGALMASUK,
    TANGGALKELUAR,
    STATUS,
    TOTAL_HARGA_KAMAR,
    TOTALOBAT,
    TOTALTINDAKAN,
    TOTALBIAYA,
    CATATAN
  });
}
