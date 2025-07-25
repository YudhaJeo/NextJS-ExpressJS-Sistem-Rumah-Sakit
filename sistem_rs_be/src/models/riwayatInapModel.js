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
      'riwayat_rawat_inap.TOTALKAMAR',
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
      'riwayat_rawat_inap.TOTALKAMAR'
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
    TANGGALKELUAR,
    NOMORBED,
    TOTALKAMAR,
    TOTALOBAT,
    TOTALTINDAKAN,
    TOTALBIAYA,
  } = rawatInap;

  // Insert ke riwayat_rawat_inap
  const [insertedRiwayat] = await db('riwayat_rawat_inap').insert({
    IDRAWATINAP,
    TANGGALKELUAR,
    NOMORBED,
    TOTALKAMAR,
    TOTALOBAT,
    TOTALTINDAKAN,
    TOTALBIAYA,
  });

  // ambil semua data obat_inap berdasarkan IDRAWATINAP
  const obatInap = await db('obat_inap').where({ IDRAWATINAP });

  // ambil semua data tindakan_inap berdasarkan IDRAWATINAP
  const tindakanInap = await db('tindakan_inap').where({ IDRAWATINAP });

  // log buat debugging
  console.log('>> Data Obat Inap yang Akan Disalin ke Riwayat:', obatInap);
  console.log('>> Data Tindakan Inap yang Akan Disalin ke Riwayat:', tindakanInap);

  // salin ke riwayat_obat_inap
  if (obatInap.length > 0) {
    const obatRiwayat = obatInap.map((obat) => ({
      IDRAWATINAP: obat.IDRAWATINAP,
      IDOBAT: obat.IDOBAT,
      JUMLAH: obat.JUMLAH,
      TOTAL: obat.TOTAL,
    }));
    await db('riwayat_obat_inap').insert(obatRiwayat);
  }

  // salin ke riwayat_tindakan_inap
  if (tindakanInap.length > 0) {
    const tindakanRiwayat = tindakanInap.map((tindakan) => ({
      IDRAWATINAP: tindakan.IDRAWATINAP,
      IDTINDAKAN: tindakan.IDTINDAKAN,
      HARGA: tindakan.HARGA,
    }));
    await db('riwayat_tindakan_inap').insert(tindakanRiwayat);
  }
}