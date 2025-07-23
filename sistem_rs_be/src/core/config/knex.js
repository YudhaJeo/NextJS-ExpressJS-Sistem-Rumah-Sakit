// sistem_rs_be\src\core\config\knex.js
import knex from 'knex';
import config from '../../../knexfile.js';

const db = knex(config.development);

export default db;