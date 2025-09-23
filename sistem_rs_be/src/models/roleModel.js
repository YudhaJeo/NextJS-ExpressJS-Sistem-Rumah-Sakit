import db from '../core/config/knex.js';

export const getAllRoles = () => db('role');

export const getRoleById = (id) =>
  db('ROLE').where({ IDROLE: id }).first();