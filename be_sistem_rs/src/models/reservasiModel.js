//modelsReservasi
import db from '../core/config/knex.js';

export const getAll = () => {
    return db('reservasi')
      .join('pasien', 'reservasi.NIK', 'pasien.NIK') 
      .select('reservasi.*', 'pasien.NAMALENGKAP');
  }

export const create = (data) => {
  return db('reservasi').insert(data);
}

export const update = (id, data) => {
    return db('reservasi').where('IDRESERVASI', id).update(data);
}

export const remove = (id) => {
    return db('reservasi').where('IDRESERVASI', id).del();
}
