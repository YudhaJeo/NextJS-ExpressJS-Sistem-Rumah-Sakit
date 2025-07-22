import db from '../core/config/knex.js';

export const getPendaftaranIdByPengobatanId = async (id) => {
  const row = await db('riwayat_pengobatan')
    .select('IDPENDAFTARAN')
    .where('IDPENGOBATAN', id)
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
  return db('riwayat_pengobatan as r')
    .join('pendaftaran as p', 'r.IDPENDAFTARAN', 'p.IDPENDAFTARAN')
    .join('pasien as ps', 'p.NIK', 'ps.NIK')
    .join('dokter as d', 'r.IDDOKTER', 'd.IDDOKTER')
    .join('master_tenaga_medis as tm', 'd.IDTENAGAMEDIS', 'tm.IDTENAGAMEDIS')
    .join('poli as pl', 'd.IDPOLI', 'pl.IDPOLI')
    .select(
      'r.IDPENGOBATAN',
      'r.IDPENDAFTARAN',
      'p.NIK',
      'ps.NAMALENGKAP',
      'r.TANGGALKUNJUNGAN',
      'r.KELUHAN',
      'd.IDTENAGAMEDIS',
      'd.IDPOLI',
      'tm.NAMALENGKAP as NAMADOKTER',
      'pl.NAMAPOLI as POLI', 
      'r.IDDOKTER',
      'r.STATUSKUNJUNGAN',
      'r.STATUSRAWAT',
      'r.DIAGNOSA',
      'r.OBAT'
    );

};

export const createPengobatan = async ({
  IDPENDAFTARAN,
  IDDOKTER,
  STATUSKUNJUNGAN,
  STATUSRAWAT,
  DIAGNOSA,
  OBAT
}, trx = db) => {
  // Ambil data pendaftaran
  const pendaftaran = await trx('pendaftaran')
    .join('pasien', 'pendaftaran.NIK', 'pasien.NIK')
    .select(
      'pendaftaran.NIK',
      'pendaftaran.TANGGALKUNJUNGAN',
      'pendaftaran.KELUHAN',
      'pendaftaran.STATUSKUNJUNGAN'
    )
    .where('pendaftaran.IDPENDAFTARAN', IDPENDAFTARAN)
    .first();

  if (!pendaftaran) throw new Error('Data pendaftaran tidak ditemukan');

  const dokter = await trx('dokter')
    .select('IDTENAGAMEDIS', 'IDPOLI')
    .where('IDDOKTER', IDDOKTER)
    .first();

  if (!dokter) throw new Error('Data dokter tidak ditemukan');

  const data = {
    IDPENDAFTARAN,
    NIK: pendaftaran.NIK,
    TANGGALKUNJUNGAN: pendaftaran.TANGGALKUNJUNGAN,
    KELUHAN: pendaftaran.KELUHAN,
    IDDOKTER: dokter.IDTENAGAMEDIS,
    IDPOLI: dokter.IDPOLI,
    STATUSKUNJUNGAN: STATUSKUNJUNGAN || pendaftaran.STATUSKUNJUNGAN,
    STATUSRAWAT,
    DIAGNOSA,
    OBAT
  };

  return trx('riwayat_pengobatan').insert(data);
};

export const updatePengobatan = (id, data) => {
  return db('riwayat_pengobatan')
    .where('IDPENGOBATAN', id)
    .update({ ...data, UPDATED_AT: db.fn.now() });
};

export const deletePengobatan = (id) => {
  return db('riwayat_pengobatan').where('IDPENGOBATAN', id).del();
};
