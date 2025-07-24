// src/models/rawatInapModel.js
import db from '../core/config/knex.js';

export const getAll = () =>
  db('rawat_inap')
    .join('pasien', 'rawat_inap.IDPASIEN', 'pasien.IDPASIEN')
    .join('bed', 'rawat_inap.IDBED', 'bed.IDBED')
    .join('kamar', 'bed.IDKAMAR', 'kamar.IDKAMAR')
    .join('bangsal', 'kamar.IDBANGSAL', 'bangsal.IDBANGSAL')
    .join('jenis_bangsal', 'bangsal.IDJENISBANGSAL', 'jenis_bangsal.IDJENISBANGSAL')
    .select(
      'rawat_inap.*',
      'pasien.NAMALENGKAP',
      'bed.NOMORBED',
      'jenis_bangsal.HARGA_PER_HARI'
    );

export const getById = (id) =>
  db('rawat_inap')
    .where({ IDRAWATINAP: id })
    .first();

export const create = async (data) => {
  const { IDPASIEN, IDBED, TANGGALMASUK, TANGGALKELUAR, CATATAN } = data;

  // ambil harga_per_hari dari jenis_bangsal
  const harga = await db('bed')
    .join('kamar', 'bed.IDKAMAR', 'kamar.IDKAMAR')
    .join('bangsal', 'kamar.IDBANGSAL', 'bangsal.IDBANGSAL')
    .join('jenis_bangsal', 'bangsal.IDJENISBANGSAL', 'jenis_bangsal.IDJENISBANGSAL')
    .where('bed.IDBED', IDBED)
    .select('jenis_bangsal.HARGA_PER_HARI')
    .first();

  const tanggalMasuk = new Date(TANGGALMASUK);
  const tanggalKeluar = TANGGALKELUAR ? new Date(TANGGALKELUAR) : null;

  let totalHarga = null;
  let status = 'AKTIF';

  if (tanggalKeluar) {
    const durasi = Math.max(1, Math.ceil((tanggalKeluar - tanggalMasuk) / (1000 * 60 * 60 * 24)));
    totalHarga = harga.HARGA_PER_HARI * durasi;
    status = 'SELESAI';
  }

  return db('rawat_inap').insert({
    IDPASIEN,
    IDBED,
    TANGGALMASUK,
    TANGGALKELUAR,
    STATUS: status,
    TOTAL_HARGA_KAMAR: totalHarga,
    CATATAN
  });
};

export const update = async (id, data) => {
  const { TANGGALMASUK, TANGGALKELUAR, IDBED, CATATAN } = data;

  const rawat = await db('rawat_inap').where({ IDRAWATINAP: id }).first();
  const bed = IDBED || rawat.IDBED;
  const tanggalMasuk = new Date(TANGGALMASUK || rawat.TANGGALMASUK);
  const tanggalKeluar = TANGGALKELUAR ? new Date(TANGGALKELUAR) : null;

  let totalHarga = null;
  let status = 'AKTIF';

  if (tanggalKeluar) {
    const harga = await db('bed')
      .join('kamar', 'bed.IDKAMAR', 'kamar.IDKAMAR')
      .join('bangsal', 'kamar.IDBANGSAL', 'bangsal.IDBANGSAL')
      .join('jenis_bangsal', 'bangsal.IDJENISBANGSAL', 'jenis_bangsal.IDJENISBANGSAL')
      .where('bed.IDBED', bed)
      .select('jenis_bangsal.HARGA_PER_HARI')
      .first();

    const durasi = Math.max(1, Math.ceil((tanggalKeluar - tanggalMasuk) / (1000 * 60 * 60 * 24)));
    totalHarga = harga.HARGA_PER_HARI * durasi;
    status = 'SELESAI';
  }

  await db('rawat_inap')
    .where({ IDRAWATINAP: id })
    .update({
      TANGGALMASUK: tanggalMasuk,
      TANGGALKELUAR: tanggalKeluar,
      STATUS: status,
      TOTAL_HARGA_KAMAR: totalHarga,
      CATATAN,
      UPDATED_AT: db.fn.now(),
    });

  // ambil data setelah update
  const updatedRawat = await db('rawat_inap').where({ IDRAWATINAP: id }).first();
  return updatedRawat;
};


export const remove = (id) =>
  db('rawat_inap').where({ IDRAWATINAP: id }).delete();

export const updateBedStatus = (id, status) =>
  db('bed').where({ IDBED: id }).update({ STATUS: status });

export const getTotalObatInap = async (IDRAWATINAP) => {
  const result = await db('riwayat_obat_inap')
    .where({ IDRIWAYATINAP: IDRAWATINAP })
    .sum('TOTAL as total');
  return result[0];
};

export const getTotalTindakanInap = async (IDRAWATINAP) => {
  const result = await db('riwayat_tindakan_inap')
    .where({ IDRIWAYATINAP: IDRAWATINAP })
    .sum('TOTAL as total');
  return result[0];
};