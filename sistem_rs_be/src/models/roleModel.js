import db from '../core/config/knex.js';

export const getAllRoles = () => db('role');

export const getRoleById = (id) =>
  db('ROLE').where({ IDROLE: id }).first();

export const createRole = (data) =>
  db('ROLE').insert(data);

export const updateRole = (id, data) =>
  db('ROLE').where({ IDROLE: id }).update(data);

export const deleteRole = (id) =>
  db('ROLE').where({ IDROLE: id }).del();
