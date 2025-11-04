import db from '../core/config/knex.js';

export async function getProfile() {
  return db('profile_mobile').first();
}

export const getById = (id) => {
  return db('profile_mobile').where('IDPROFILE', id).first();
};

export async function updateProfile(id, data) {
  return db('profile_mobile')
    .where({ IDPROFILE: id })
    .update({
      ...data,
      UPDATED_AT: db.fn.now(),
    });
}
