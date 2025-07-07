// src/models/authModel.js
import db from '../core/config/knex.js';

export const findUserByEmail = (email) => {
  return db('users').where({ EMAIL: email }).first();
};