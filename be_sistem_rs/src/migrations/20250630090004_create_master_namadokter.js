// src/migrations/20250630090300_create_master_nama_dokter_table.js
export const up = function (knex) {
    return knex.schema.createTable('nama_dokter', (table) => {
      table.increments('IDDOKTER').primary();
      table.string('NAMADOKTER', 100).notNullable().unique();
      table.string('SPESIALIS', 100).nullable();
    });
};

export const down = function (knex) {
    return knex.schema.dropTable('nama_dokter');
};
