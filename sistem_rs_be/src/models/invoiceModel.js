import db from '../core/config/knex.js';

export const getAll = () => {
  return db('invoice as i')
    .join('pasien as p', 'i.NIK', 'p.NIK')
    .leftJoin('asuransi as a', 'p.IDASURANSI', 'a.IDASURANSI')
    .leftJoin('riwayat_rawat_inap as rri', 'i.IDRIWAYATINAP', 'rri.IDRIWAYATINAP')
    .select(
      'i.*',
      'p.NAMALENGKAP as NAMAPASIEN',
      'a.NAMAASURANSI as ASURANSI',
      'rri.NOMORBED',
      'rri.TANGGALMASUK',
      'rri.TANGGALKELUAR',
      'rri.TOTALKAMAR',
      'rri.TOTALOBAT',
      'rri.TOTALTINDAKAN',
      'rri.TOTALBIAYA'
    )
    .orderBy('i.TANGGALINVOICE', 'desc');
};

export const getById = (id) => {
  return db('invoice as i')
    .join('pasien as p', 'i.NIK', 'p.NIK')
    .leftJoin('asuransi as a', 'p.IDASURANSI', 'a.IDASURANSI')
    .leftJoin('riwayat_rawat_inap as rri', 'i.IDRIWAYATINAP', 'rri.IDRIWAYATINAP')
    .select(
      'i.*',
      'p.NAMALENGKAP as NAMAPASIEN',
      'a.NAMAASURANSI as ASURANSI',
      'rri.NOMORBED',
      'rri.TANGGALMASUK',
      'rri.TANGGALKELUAR',
      'rri.TOTALKAMAR',
      'rri.TOTALOBAT',
      'rri.TOTALTINDAKAN',
      'rri.TOTALBIAYA'
    )
    .where('i.IDINVOICE', id)
    .first();
};

export const update = (id, data) => {
  return db('invoice').where('IDINVOICE', id).update(data);
};

export const remove = (id) => {
  return db('invoice').where('IDINVOICE', id).del();
};