import db from '../core/config/knex.js';

export const getAllKomisi = () => 
    db('komisi_dokter')
    .join('dokter', 'komisi_dokter.IDDOKTER', 'dokter.IDDOKTER')
    .select('komisi_dokter.*', 'dokter.NAMADOKTER');

export const getByIdKomisi = (id) => 
    db('komisi_dokter').where({ IDKOMISI: id }).first();

export const createKomisi = (data) => 
    db('komisi_dokter').insert(data);

export const updateKomisi = (id, data) =>
    db('komisi_dokter').where({ IDKOMISI: id }).update(data);
  
export const removeKomisi = (id) =>
    db('komisi_dokter').where({ IDKOMISI: id }).del();
