import db from '../core/config/knex.js';

export const getAll = () => {
  return db('data_dokter')
    .join('dokter', 'data_dokter.IDDOKTER', 'dokter.IDDOKTER')
    .join('poli', 'data_dokter.IDPOLI', 'poli.IDPOLI')
    .leftJoin('jadwal_dokter', 'dokter.IDDOKTER', 'jadwal_dokter.IDDOKTER')
    .groupBy([
      'data_dokter.IDDATA',
      'data_dokter.IDDOKTER',
      'data_dokter.IDPOLI',
      'data_dokter.IDJADWAL',
      'data_dokter.NO_TELEPON',
      'data_dokter.EMAIL',
      'data_dokter.ALAMAT',
      'data_dokter.JENIS_KELAMIN',
      'dokter.NAMADOKTER',
      'poli.NAMAPOLI'
    ])
    .select(
      'data_dokter.IDDATA',
      'data_dokter.IDDOKTER',
      'data_dokter.IDPOLI',
      'data_dokter.IDJADWAL',
      'data_dokter.NO_TELEPON',
      'data_dokter.EMAIL',
      'data_dokter.ALAMAT',
      'data_dokter.JENIS_KELAMIN',
      'dokter.NAMADOKTER',
      'poli.NAMAPOLI',
      db.raw(`
        GROUP_CONCAT(
          CONCAT(jadwal_dokter.HARI, ' ', jadwal_dokter.JAM_MULAI, '-', jadwal_dokter.JAM_SELESAI)
          SEPARATOR ', '
        ) as JADWAL
      `)
    );
};

export const getById = (id) => {
  return db('data_dokter').where('IDDATA', id).first();
};

export const create = (data) => {
  return db('data_dokter').insert(data);
};

export const update = (id, data) => {
  return db('data_dokter').where('IDDATA', id).update(data);
};

export const remove = (id) => {
  return db('data_dokter').where('IDDATA', id).del();
};
