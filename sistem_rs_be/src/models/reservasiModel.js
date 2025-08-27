import db from '../core/config/knex.js';

export const getAll = async () => {
  const rows = await db('reservasi')
    .join('pasien', 'reservasi.NIK', 'pasien.NIK')
    .join('poli', 'reservasi.IDPOLI', 'poli.IDPOLI')
    .join('dokter', 'reservasi.IDDOKTER', 'dokter.IDDOKTER')
    .leftJoin('jadwal_dokter', 'dokter.IDDOKTER', 'jadwal_dokter.IDDOKTER')
    .leftJoin('master_tenaga_medis', 'dokter.IDTENAGAMEDIS', 'master_tenaga_medis.IDTENAGAMEDIS')
    .select(
      'reservasi.*',
      'pasien.NAMALENGKAP',
      'poli.NAMAPOLI',
      'dokter.IDDOKTER',
      'master_tenaga_medis.NAMALENGKAP as NAMADOKTER',
    );

  const result = {};
  rows.forEach((row) => {
    if (!result[row.IDRESERVASI]) {
      result[row.IDRESERVASI] = {
        IDRESERVASI: row.IDRESERVASI,
        NIK: row.NIK,
        TANGGALRESERVASI: row.TANGGALRESERVASI,
        IDPOLI: row.IDPOLI,
        IDDOKTER: row.IDDOKTER,
        STATUS: row.STATUS,
        KETERANGAN: row.KETERANGAN,
        NAMALENGKAP: row.NAMALENGKAP,
        NAMAPOLI: row.NAMAPOLI,
        NAMADOKTER: row.NAMADOKTER,
        JADWALPRAKTEK: [],
        JAMRESERVASI: row.JAMRESERVASI || '-',
      };
    }
  });

  return Object.values(result);
};

export const create = (data) => {
  return db('reservasi').insert(data);
}

export const update = (id, data) => {
  return db('reservasi').where('IDRESERVASI', id).update(data);
}

export const remove = (id) => {
  return db('reservasi').where('IDRESERVASI', id).del();
}
