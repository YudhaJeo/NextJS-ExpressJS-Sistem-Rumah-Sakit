import db from '../core/config/knex.js';

export const getPendaftaranIdByPengobatanId = async (id) => {
  const row = await db('riwayat_pengobatan')
    .select('IDPENDAFTARAN')
    .where('IDPENGOBATAN', id)
    .first();

  return row?.IDPENDAFTARAN;
};

export const getPendaftaranById = (id) => {
  return db('pendaftaran')
    .where('IDPENDAFTARAN', id)
    .first();   
};

export const getAllPengobatan = () => {
  return db('riwayat_pengobatan as r')
    .join('pendaftaran as p', 'r.IDPENDAFTARAN', 'p.IDPENDAFTARAN')
    .join('pasien as ps', 'p.NIK', 'ps.NIK')
    .join('poli as pl', 'p.IDPOLI', 'pl.IDPOLI')
    .select(
      'r.IDPENGOBATAN',
      'r.IDPENDAFTARAN',
      'p.NIK',
      'ps.NAMALENGKAP',
      'p.TANGGALKUNJUNGAN',
      'p.KELUHAN',
      'pl.NAMAPOLI as POLI',
      'r.STATUSKUNJUNGAN',
      'r.STATUSRAWAT',
      'r.DIAGNOSA',
      'r.OBAT'
    );
};

export const createPengobatan = async ({ IDPENDAFTARAN, STATUSKUNJUNGAN, STATUSRAWAT, DIAGNOSA, OBAT }) => {
  const [pendaftaran] = await db('pendaftaran')
    .join('pasien', 'pendaftaran.NIK', 'pasien.NIK')
    .join('poli', 'pendaftaran.IDPOLI', 'poli.IDPOLI')
    .select(
      'pendaftaran.NIK',
      'pendaftaran.TANGGALKUNJUNGAN',
      'pendaftaran.KELUHAN',
      'poli.IDPOLI',
      'pendaftaran.STATUSKUNJUNGAN'
    )
    .where('pendaftaran.IDPENDAFTARAN', IDPENDAFTARAN);

  if (!pendaftaran) {
    throw new Error('Data pendaftaran tidak ditemukan');
  }

  const data = {
    IDPENDAFTARAN,
    NIK: pendaftaran.NIK,
    TANGGALKUNJUNGAN: pendaftaran.TANGGALKUNJUNGAN,
    KELUHAN: pendaftaran.KELUHAN,
    IDPOLI: pendaftaran.IDPOLI,
    STATUSKUNJUNGAN: STATUSKUNJUNGAN || pendaftaran.STATUSKUNJUNGAN,
    STATUSRAWAT,
    DIAGNOSA,
    OBAT
  };

  return db('riwayat_pengobatan').insert(data);
};

export const updatePengobatan = (id, data) => {
  return db('riwayat_pengobatan').where('IDPENGOBATAN', id).update(data);
};

export const deletePengobatan = (id) => {
  return db('riwayat_pengobatan').where('IDPENGOBATAN', id).del();
};