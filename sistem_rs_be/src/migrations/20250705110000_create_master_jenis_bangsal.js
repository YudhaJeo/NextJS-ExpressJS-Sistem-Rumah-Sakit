// src/migrations/20250705110000_create_master_jenis_bangsal.js
export const up = function (knex) {
  return knex.schema.createTable('jenis_bangsal', (table) => {
    table.increments('IDJENISBANGSAL').primary();
    table.string('NAMAJENIS', 50).notNullable().unique();
    table.specificType('HARGAPERHARI', 'DOUBLE').notNullable();
    table.text('FASILITAS');
  });
};

export const down = function (knex) {
  return knex.schema.dropTable('jenis_bangsal');
};