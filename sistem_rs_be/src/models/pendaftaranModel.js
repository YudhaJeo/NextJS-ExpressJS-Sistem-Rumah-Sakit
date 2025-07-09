import db from '../core/config/knex.js';

export const getAll = () =>{
  return db('pendaftaran')
    .join('pasien', 'pendaftaran.NIK', 'pasien.NIK')
    .join('poli', 'pendaftaran.IDPOLI', 'poli.IDPOLI')
    .select('pendaftaran.*', 'pasien.NAMALENGKAP', 'poli.NAMAPOLI as POLI');
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
