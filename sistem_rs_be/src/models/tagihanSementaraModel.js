// src\models\tagihanSementaraModel.js
import db from '../core/config/knex.js';

export const getAllTagihanSementara = async () => {
    const data = await db('rawat_inap')
      .join('pasien', 'rawat_inap.IDPASIEN', 'pasien.IDPASIEN')
      .join('bed', 'rawat_inap.IDBED', 'bed.IDBED') 
  
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
  
      .select(
        'rawat_inap.IDRAWATINAP',
        'pasien.NAMALENGKAP',
        'bed.NOMORBED',
        'rawat_inap.TOTALKAMAR',
        db.raw('COALESCE(obat_total.TOTAL_OBAT, 0) AS TOTAL_OBAT'),
        db.raw('COALESCE(tindakan_total.TOTAL_TINDAKAN, 0) AS TOTAL_TINDAKAN'),
        db.raw(`(rawat_inap.TOTALKAMAR 
                + COALESCE(obat_total.TOTAL_OBAT, 0) 
                + COALESCE(tindakan_total.TOTAL_TINDAKAN, 0)) 
                AS TOTAL_SEMENTARA`)
      );
  
    return data;
  };
  