// src/migrations/20250630090300_create_master_dokter_table.js
export const up = function (knex) {
  return knex.schema.createTable('dokter', (table) => {
    table.increments('IDDOKTER').primary();
    table.string('NAMADOKTER', 100).notNullable();
    table
      .integer('IDPOLI')
      .unsigned()
      .notNullable()
      .references('IDPOLI')
      .inTable('poli')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });
};

export const down = function (knex) {
  return knex.schema.dropTable('dokter');
};