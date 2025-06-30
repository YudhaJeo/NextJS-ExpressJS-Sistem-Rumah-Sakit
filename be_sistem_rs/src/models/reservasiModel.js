//modelsReservasi
import db from '../core/config/knex.js';

export const getAll = () => {
    return db('reservasi')
        .join('pasien', 'reservasi.NIK', 'pasien.NIK') 
        .join('poli', 'reservasi.IDPOLI', 'poli.IDPOLI')
        .join('nama_dokter', 'reservasi.IDDOKTER', 'nama_dokter.IDDOKTER')
        .select(
            'reservasi.*',
            'pasien.NAMALENGKAP',
            'poli.NAMAPOLI',
            'nama_dokter.NAMADOKTER'
        );
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
