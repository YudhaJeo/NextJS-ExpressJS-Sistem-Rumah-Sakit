// D:\MARSTECH\NextJS-ExpressJS-Final-System\sistem_rs_be\src\models\rawatJalanModel.js
import db from '../core/config/knex.js';

export const getPendaftaranIdByRawatJalanId = async (id) => {
  const row = await db('rawat_jalan')
    .select('IDPENDAFTARAN')
    .where('IDRAWATJALAN', id)
    .first();

  return row?.IDPENDAFTARAN;
};

export const getDokterByPoli = async (IDPOLI) => {
  return db('dokter')
    .where('IDPOLI', IDPOLI)
    .orderBy('IDDOKTER', 'asc')
    .first();
};

export const getPendaftaranById = (id) => {
  return db('pendaftaran').where('IDPENDAFTARAN', id).first();
};

export const getAllRawatJalan = () => {
  return db('rawat_jalan as r')
    .join('pendaftaran as p', 'r.IDPENDAFTARAN', 'p.IDPENDAFTARAN')
    .join('pasien as ps', 'p.NIK', 'ps.NIK')
    .join('dokter as d', 'r.IDDOKTER', 'd.IDDOKTER')
    .join('master_tenaga_medis as tm', 'd.IDTENAGAMEDIS', 'tm.IDTENAGAMEDIS')
    .join('poli as pl', 'p.IDPOLI', 'pl.IDPOLI')
    .select(
      'r.IDPENDAFTARAN',
      db.raw('MAX(r.IDRAWATJALAN) as IDRAWATJALAN'),
      'r.IDDOKTER',
      'ps.NAMALENGKAP',
      'ps.NIK',
      'ps.JENISKELAMIN',
      db.raw('ps.ALAMAT as ALAMAT_PASIEN'),
      'p.TANGGALKUNJUNGAN',
      'p.KELUHAN',
      'pl.NAMAPOLI as POLI',
      'r.STATUSKUNJUNGAN',
      'r.STATUSRAWAT',
      'r.DIAGNOSA',
      'r.KETERANGAN',
      'r.FOTORESEP',
      'tm.NAMALENGKAP as NAMADOKTER'
    )
    .groupBy(
      'r.IDPENDAFTARAN',
      'r.IDDOKTER',
      'ps.NAMALENGKAP',
      'ps.NIK',
      'ps.JENISKELAMIN',
      'ps.ALAMAT',
      'p.TANGGALKUNJUNGAN',
      'p.KELUHAN',
      'pl.NAMAPOLI',
      'r.STATUSKUNJUNGAN',
      'r.STATUSRAWAT',
      'r.DIAGNOSA',
      'r.KETERANGAN',
      'r.FOTORESEP',
      'tm.NAMALENGKAP'
    )
    .orderBy('p.TANGGALKUNJUNGAN', 'desc'); // urutkan terbaru paling atas
};

export const createRawatJalan = async ({
  IDPENDAFTARAN,
  IDDOKTER,
  STATUSKUNJUNGAN,
  STATUSRAWAT,
  DIAGNOSA,
  KETERANGAN,
  FOTORESEP
}, trx = db) => {
  const pendaftaran = await trx('pendaftaran')
    .join('pasien', 'pendaftaran.NIK', 'pasien.NIK')
    .select('pendaftaran.STATUSKUNJUNGAN')
    .where('pendaftaran.IDPENDAFTARAN', IDPENDAFTARAN)
    .first();

  if (!pendaftaran) throw new Error('Data pendaftaran tidak ditemukan');

  const dokter = await trx('dokter')
    .select('IDDOKTER')
    .where('IDDOKTER', IDDOKTER)
    .first();

  if (!dokter) throw new Error('Data dokter tidak ditemukan');

  const data = {
    IDPENDAFTARAN,
    IDDOKTER: dokter.IDDOKTER,
    STATUSKUNJUNGAN: STATUSKUNJUNGAN || pendaftaran.STATUSKUNJUNGAN,
    STATUSRAWAT,
    DIAGNOSA,
    KETERANGAN,
    FOTORESEP
  };

  return trx('rawat_jalan').insert(data);
};

export const updateRawatJalan = (id, data) => {
  return db('rawat_jalan')
    .where('IDRAWATJALAN', id)
    .update({ ...data, UPDATED_AT: db.fn.now() });
};

export const deleteRawatJalan = (id) => {
  return db('rawat_jalan')
    .where('IDRAWATJALAN', id)
    .del();
};

export const getRawatById = async (id) => {
  return await db('rawat_jalan').where('IDRAWATJALAN', id).first();
};

export const getTotalTindakanJalan = async (IDRAWATJALAN) => {
  const result = await db('tindakan_jalan')
    .where({ IDRAWATJALAN })
    .sum('TOTAL as total');
  return result[0];
};


export const insertFromRawatJalan = async (data) => {
  const totalTindakanRes = await db('tindakan_jalan')
    .where({ IDRAWATJALAN: data.IDRAWATJALAN })
    .sum('TOTAL as total');
  const totalTindakan = totalTindakanRes[0]?.total || 0;

  const totalBiaya = totalTindakan;
  
  const insertData = {
    IDRAWATJALAN: data.IDRAWATJALAN,
    IDDOKTER: data.IDDOKTER,
    DIAGNOSA: data.DIAGNOSA,
    KETERANGAN: data.KETERANGAN,
    FOTORESEP: data.FOTORESEP,
    TOTALTINDAKAN: totalTindakan,
    TOTALBIAYA: totalBiaya,
    CREATED_AT: db.fn.now()
  };

  const [id] = await db("riwayat_rawat_jalan").insert(insertData);
  return id;
};