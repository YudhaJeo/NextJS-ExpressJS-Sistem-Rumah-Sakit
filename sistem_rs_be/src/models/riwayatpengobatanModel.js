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
    .join('poli as pl', 'p.IDPOLI', 'pl.IDPOLI')
    .select(
      'r.IDPENDAFTARAN',
      db.raw('MAX(r.IDPENGOBATAN) as IDPENGOBATAN'),
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
      'tm.NAMALENGKAP'
    );
};


// ✅ Menyimpan data pengobatan baru
export const createPengobatan = async ({
  IDPENDAFTARAN,
  IDDOKTER,
  STATUSKUNJUNGAN,
  STATUSRAWAT,
  DIAGNOSA,
  OBAT
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
  return db('riwayat_pengobatan')
    .where('IDPENGOBATAN', id)
    .del();
};

