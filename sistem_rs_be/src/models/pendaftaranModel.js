import db from '../core/config/knex.js';

export const getAll = () =>{
  return db('pendaftaran')
    .join('pasien', 'pendaftaran.NIK', 'pasien.NIK')
    .select('pendaftaran.*', 'pasien.NAMALENGKAP');
}

export const create = (data) => {
  return db('pendaftaran').insert(data);
}

export const update = (id, data) => {
  return db('pendaftaran').where('IDPENDAFTARAN', id).update(data);
}

export const remove = (id) => {
  return db('pendaftaran').where('IDPENDAFTARAN', id).del();
}
