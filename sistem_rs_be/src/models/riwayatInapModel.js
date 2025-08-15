import db from '../core/config/knex.js';

export async function getAllRiwayatInap() {
  return await db('riwayat_rawat_inap')
    .join('rawat_inap', 'riwayat_rawat_inap.IDRAWATINAP', 'rawat_inap.IDRAWATINAP')
    .join('rawat_jalan', 'rawat_inap.IDRAWATJALAN', 'rawat_jalan.IDRAWATJALAN')
    .join('pendaftaran', 'rawat_jalan.IDPENDAFTARAN', 'pendaftaran.IDPENDAFTARAN')
    .join('pasien', 'pendaftaran.NIK', 'pasien.NIK')
    .join('bed', 'rawat_inap.IDBED', 'bed.IDBED')
    .select(
      'riwayat_rawat_inap.*',
      'pasien.NAMALENGKAP',
      'bed.NOMORBED',
    )
    .orderBy('riwayat_rawat_inap.IDRIWAYATINAP', 'desc');
}

export async function getRiwayatInapById(id) {
  return await db('riwayat_rawat_inap')
    .join('rawat_inap', 'riwayat_rawat_inap.IDRAWATINAP', 'rawat_inap.IDRAWATINAP')
    .join('rawat_jalan', 'rawat_inap.IDRAWATJALAN', 'rawat_jalan.IDRAWATJALAN')
    .join('pendaftaran', 'rawat_jalan.IDPENDAFTARAN', 'pendaftaran.IDPENDAFTARAN')
    .join('pasien', 'pendaftaran.NIK', 'pasien.NIK')
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
    .select('obat.NAMAOBAT', 'obat.JENISOBAT', 'riwayat_obat_inap.JUMLAH', 'riwayat_obat_inap.HARGA', 'riwayat_obat_inap.TOTAL')
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
    NOMORBED,
    TOTALKAMAR,
    TOTALOBAT,
    TOTALTINDAKAN,
    TOTALBIAYA,
  } = rawatInap;

  const [insertedRiwayat] = await db('riwayat_rawat_inap').insert({
    IDRAWATINAP,
    TANGGALMASUK,
    TANGGALKELUAR,
    NOMORBED,
    TOTALKAMAR,
    TOTALOBAT,
    TOTALTINDAKAN,
    TOTALBIAYA,
  });

  const IDRIWAYATINAP = insertedRiwayat ?? await db('riwayat_rawat_inap')
    .where({ IDRAWATINAP })
    .select('IDRIWAYATINAP')
    .first()
    .then((row) => row?.IDRIWAYATINAP);

  const obatInap = await db('obat_inap').where({ IDRAWATINAP });
  const tindakanInap = await db('tindakan_inap').where({ IDRAWATINAP });

  if (obatInap.length > 0) {
    const obatRiwayat = obatInap.map((obat) => ({
      IDRIWAYATINAP,
      IDOBAT: obat.IDOBAT,
      IDTENAGAMEDIS: obat.IDTENAGAMEDIS,
      WAKTUPEMBERIAN: obat.WAKTUPEMBERIAN,
      JUMLAH: obat.JUMLAH,
      HARGA: obat.HARGA,
      TOTAL: obat.TOTAL,
    }));
    await db('riwayat_obat_inap').insert(obatRiwayat);
  }

  if (tindakanInap.length > 0) {
    const tindakanRiwayat = tindakanInap.map((tindakan) => ({
      IDRIWAYATINAP,
      IDTINDAKAN: tindakan.IDTINDAKAN,
      IDTENAGAMEDIS: tindakan.IDTENAGAMEDIS,
      WAKTUPEMBERIAN: tindakan.WAKTUPEMBERIAN,
      JUMLAH: tindakan.JUMLAH,
      HARGA: tindakan.HARGA,
      TOTAL: tindakan.TOTAL,
    }));
    await db('riwayat_tindakan_inap').insert(tindakanRiwayat);
  }

  const rawatData = await db('rawat_inap').where({ IDRAWATINAP }).first();
  if (rawatData?.IDBED) {
    await db('bed').where({ IDBED: rawatData.IDBED }).update({ STATUS: 'TERSEDIA' });
  }

  if (rawatData) {
    const pasienData = await db('rawat_inap')
      .join('rawat_jalan', 'rawat_inap.IDRAWATJALAN', 'rawat_jalan.IDRAWATJALAN')
      .join('pendaftaran', 'rawat_jalan.IDPENDAFTARAN', 'pendaftaran.IDPENDAFTARAN')
      .select('pendaftaran.NIK')
      .where('rawat_inap.IDRAWATINAP', IDRAWATINAP)
      .first();

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
  }
}