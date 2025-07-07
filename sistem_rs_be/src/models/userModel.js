// src/models/userModel.js
import db from '../core/config/knex.js';

export const getById = (id) =>
  db('users')
    .where({ ID: id })
    .first();

export const updateProfile = (id, data) =>
  db('users')
    .where({ ID: id })
    .update({
      USERNAME: data.username,
      EMAIL: data.email,
      ROLE: data.role,
    });