import db from '../core/config/knex.js';

export const getAllJadwal = () =>
  db('jadwal_praktek')
    .join('data_dokter', 'jadwal_praktek.IDDOKTER', '=', 'data_dokter.IDDOKTER')
    .select(
      'jadwal_praktek.*',
      'data_dokter.NAMA_DOKTER'
    );


export const getByIdJadwal = (id) => 
    db('jadwal_praktek as jp')
        .join('data_dokter as dd', 'jp.IDDOKTER', 'dd.IDDOKTER')
        .where('jp.ID', id)
        .select(
            'jp.ID',
            'dd.NAMA_DOKTER as DOKTER',
            'jp.HARI',
            'jp.JAM_MULAI',
            'jp.JAM_SELESAI'
        )
        .first();

export const createJadwal = (data) => 
    db('jadwal_praktek').insert(data);

export const updateJadwal = (id, data) =>
    db('jadwal_praktek').where({ ID: id }).update(data);
  
export const removeJadwal = (id) =>
    db('jadwal_praktek').where({ ID: id }).del();
