import db from '../core/config/knex.js';

export const getAll = () => {
  return db('invoice as i')
    .join('pasien as p', 'i.NIK', 'p.NIK')
    .leftJoin('asuransi as a', 'p.IDASURANSI', 'a.IDASURANSI')
    .leftJoin('riwayat_rawat_inap as rri', 'i.IDRIWAYATINAP', 'rri.IDRIWAYATINAP')
    .leftJoin('riwayat_rawat_jalan as rrj', 'i.IDRIWAYATJALAN', 'rrj.IDRIWAYATJALAN')
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
      'rri.TOTALBIAYA',
      'rrj.TANGGALRAWAT as TANGGALRAWATJALAN',
      'rrj.TOTALBIAYA as TOTALBIAYAJALAN'
    )
    .orderBy('i.TANGGALINVOICE', 'desc');
};

export const getById = (id) => {
  return db('invoice as i')
    .join('pasien as p', 'i.NIK', 'p.NIK')
    .leftJoin('asuransi as a', 'p.IDASURANSI', 'a.IDASURANSI')
    .leftJoin('riwayat_rawat_inap as rri', 'i.IDRIWAYATINAP', 'rri.IDRIWAYATINAP')
    .leftJoin('riwayat_rawat_jalan as rrj', 'i.IDRIWAYATJALAN', 'rrj.IDRIWAYATJALAN')
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
      'rri.TOTALBIAYA',
      'rrj.TANGGALRAWAT as TANGGALRAWATJALAN',
      'rrj.TOTALBIAYA as TOTALBIAYAJALAN'
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

export const getObatByInvoiceId = (invoiceId) => {
  return db('riwayat_obat_inap as ro')
    .join('obat as o', 'ro.IDOBAT', 'o.IDOBAT')
    .join('riwayat_rawat_inap as rri', 'ro.IDRIWAYATINAP', 'rri.IDRIWAYATINAP')
    .join('invoice as i', 'rri.IDRIWAYATINAP', 'i.IDRIWAYATINAP')
    .select(
      'o.IDOBAT',
      'o.NAMAOBAT',
      'o.JENISOBAT',
      'ro.JUMLAH',
      'ro.HARGA',
      'ro.TOTAL'
    )
    .where('i.IDINVOICE', invoiceId);
};

export const getTindakanByInvoiceId = (invoiceId) => {
  return db('riwayat_tindakan_inap as rt')
    .join('tindakan_medis as t', 'rt.IDTINDAKAN', 't.IDTINDAKAN')
    .join('riwayat_rawat_inap as rri', 'rt.IDRIWAYATINAP', 'rri.IDRIWAYATINAP')
    .join('invoice as i', 'rri.IDRIWAYATINAP', 'i.IDRIWAYATINAP')
    .select(
      't.IDTINDAKAN',
      't.NAMATINDAKAN',
      't.KATEGORI',
      'rt.JUMLAH',
      'rt.HARGA',
      'rt.TOTAL'
    )
    .where('i.IDINVOICE', invoiceId);
};

export const getTindakanJalanByInvoiceId = (invoiceId) => {
  return db('riwayat_tindakan_jalan as rtj')
    .join('tindakan_medis as t', 'rtj.IDTINDAKAN', 't.IDTINDAKAN')
    .join('riwayat_rawat_jalan as rrj', 'rtj.IDRIWAYATJALAN', 'rrj.IDRIWAYATJALAN')
    .join('invoice as i', 'rrj.IDRIWAYATJALAN', 'i.IDRIWAYATJALAN')
    .select(
      't.IDTINDAKAN',
      't.NAMATINDAKAN',
      't.KATEGORI',
      'rtj.JUMLAH',
      'rtj.HARGA',
      'rtj.TOTAL'
    )
    .where('i.IDINVOICE', invoiceId);
};