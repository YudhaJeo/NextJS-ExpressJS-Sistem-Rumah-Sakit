import db from '../core/config/knex.js';

export const getPendaftaranIdByPengobatanId = async (id) => {
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

export const getAllPengobatan = () => {
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
      'p.TANGGALKUNJUNGAN',
      'p.KELUHAN',
      'pl.NAMAPOLI as POLI',
      'r.STATUSKUNJUNGAN',
      'r.STATUSRAWAT',
      'r.DIAGNOSA',
      'r.OBAT',
      'r.FOTOPROFIL',
      'tm.NAMALENGKAP as NAMADOKTER'
    )
    .groupBy(
      'r.IDPENDAFTARAN',
      'r.IDDOKTER',
      'ps.NAMALENGKAP',
      'ps.NIK',
      'p.TANGGALKUNJUNGAN',
      'p.KELUHAN',
      'pl.NAMAPOLI',
      'r.STATUSKUNJUNGAN',
      'r.STATUSRAWAT',
      'r.DIAGNOSA',
      'r.OBAT',
      'r.FOTOPROFIL',
      'tm.NAMALENGKAP'
    );
};


export const createPengobatan = async ({
  IDPENDAFTARAN,
  IDDOKTER,
  STATUSKUNJUNGAN,
  STATUSRAWAT,
  DIAGNOSA,
  OBAT,
  FOTOPROFIL
}, trx = db) => {
  // Cek pendaftaran
  const pendaftaran = await trx('pendaftaran')
    .join('pasien', 'pendaftaran.NIK', 'pasien.NIK')
    .select('pendaftaran.STATUSKUNJUNGAN')
    .where('pendaftaran.IDPENDAFTARAN', IDPENDAFTARAN)
    .first();

  if (!pendaftaran) throw new Error('Data pendaftaran tidak ditemukan');

  // Ambil info dokter
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
    OBAT,
    FOTOPROFIL
  };

  return trx('rawat_jalan').insert(data);
};

export const updatePengobatan = (id, data) => {
  return db('rawat_jalan')
    .where('IDRAWATJALAN', id)
    .update({ ...data, UPDATED_AT: db.fn.now() });
};

export const deletePengobatan = (id) => {
  return db('rawat_jalan')
    .where('IDRAWATJALAN', id)
    .del();
};

export const updateFotoProfil = async (id, filename) => {
  return await db('rawat_jalan')
    .where('IDRAWATJALAN', id)
    .update({ FOTOPROFIL: filename, UPDATED_AT: db.fn.now() });
};

export const getRiwayatById = async (id) => {
  return await db('rawat_jalan').where('IDRAWATJALAN', id).first();
};

