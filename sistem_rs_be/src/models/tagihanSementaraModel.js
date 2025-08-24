import db from '../core/config/knex.js';

export const getAllTagihanSementara = async () => {
  const data = await db('rawat_inap')
    .join('rawat_jalan', 'rawat_inap.IDRAWATJALAN', 'rawat_jalan.IDRAWATJALAN')
    .join('pendaftaran', 'rawat_jalan.IDPENDAFTARAN', 'pendaftaran.IDPENDAFTARAN')
    .join('pasien', 'pendaftaran.NIK', 'pasien.NIK')
    .join('bed', 'rawat_inap.IDBED', 'bed.IDBED')
    .where('rawat_inap.STATUS', 'AKTIF')

    .leftJoin(
      db('obat_inap')
        .select('IDRAWATINAP')
        .sum('TOTAL as TOTAL_OBAT')
        .groupBy('IDRAWATINAP')
        .as('obat_total'),
      'rawat_inap.IDRAWATINAP',
      'obat_total.IDRAWATINAP'
    )

    .leftJoin(
      db('tindakan_inap')
        .select('IDRAWATINAP')
        .sum('TOTAL as TOTAL_TINDAKAN')
        .groupBy('IDRAWATINAP')
        .as('tindakan_total'),
      'rawat_inap.IDRAWATINAP',
      'tindakan_total.IDRAWATINAP'
    )

    .leftJoin(
      db('alkes_inap')
        .select('IDRAWATINAP')
        .sum('TOTAL as TOTAL_ALKES')
        .groupBy('IDRAWATINAP')
        .as('alkes_total'),
      'rawat_inap.IDRAWATINAP',
      'alkes_total.IDRAWATINAP'
    )

    .select(
      'rawat_inap.IDRAWATINAP',
      'pasien.NAMALENGKAP',
      'bed.NOMORBED',
      'rawat_inap.TOTALKAMAR',
      'rawat_inap.TANGGALMASUK',
      db.raw('COALESCE(obat_total.TOTAL_OBAT, 0) AS TOTAL_OBAT'),
      db.raw('COALESCE(tindakan_total.TOTAL_TINDAKAN, 0) AS TOTAL_TINDAKAN'),
      db.raw('COALESCE(alkes_total.TOTAL_ALKES, 0) AS TOTAL_ALKES'),
      db.raw(`
        COALESCE(
          rawat_inap.TOTALKAMAR
          + COALESCE(obat_total.TOTAL_OBAT, 0)
          + COALESCE(tindakan_total.TOTAL_TINDAKAN, 0)
          + COALESCE(alkes_total.TOTAL_ALKES, 0),
          0
        ) AS TOTAL_SEMENTARA
      `)      
    );

  return data;
};