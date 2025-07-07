// src/core/config//knex.js
// koneksi ke database pakai knexfile
import knex from 'knex';
import config from '../../../knexfile.js';

const db = knex(config.development);

export default db;