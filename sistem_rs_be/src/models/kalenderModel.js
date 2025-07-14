//model
import db from '../core/config/knex.js';

export const getAll = () =>{
  return db('kalender')
    .join('data_dokter', 'kalender.IDDOKTER', 'data_dokter.IDDOKTER')
    .select('kalender.*', 'data_dokter.IDDOKTER');
}

export const create = (data) => {
  return db('kalender').insert(data);
};

export const update = (id, data) => {
  return db('kalender').where('ID', id).update(data);
};

export const remove = (id) => {
  return db('kalender').where('ID', id).del();
};

export const getById = (id) => {
  return db('kalender').where('ID', id).first();
};
