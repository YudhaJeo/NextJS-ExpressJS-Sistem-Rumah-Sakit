import db from '../core/config/knex.js';

export function getAll() {
  return db('pendaftaran')
    .join('pasien', 'pendaftaran.NIK', 'pasien.NIK')
    .select('pendaftaran.*', 'pasien.NAMALENGKAP');
}

export function create(data) {
  return db('pendaftaran').insert(data);
}

export function update(id, data) {
  return db('pendaftaran').where('IDPENDAFTARAN', id).update(data);
}

export function remove(id) {
  return db('pendaftaran').where('IDPENDAFTARAN', id).del();
}
