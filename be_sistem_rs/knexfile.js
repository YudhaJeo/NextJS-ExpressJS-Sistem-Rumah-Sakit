/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const config = {

  development: {
    client: 'mysql2',
    connection: {
      host: 'localhost',
      user: 'root',
      password: '', // ganti jika ada password
      database: 'db_rumah_sakit'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: "./src/migrations",
      extension: "js",
      loadExtensions: [".js"],
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'db_rumah_sakit',
      user:     'root',
      password: ''
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: "./src/migrations",
      extension: "js",
    },
  }

};

export default config;
