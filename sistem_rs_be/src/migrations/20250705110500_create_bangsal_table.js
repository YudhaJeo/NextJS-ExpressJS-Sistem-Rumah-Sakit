// src/migrations/20250705110500_create_bangsal_table.js
export const up = function (knex) {
  return knex.schema.createTable('bangsal', (table) => {
    table.increments('IDBANGSAL').primary();
    table.string('NAMABANGSAL', 100).notNullable().unique();
    table.integer('IDJENISBANGSAL').unsigned().notNullable()
      .references('IDJENISBANGSAL').inTable('jenis_bangsal').onDelete('CASCADE');
    table.string('LOKASI', 100);
    table.text('KETERANGAN');
    table.timestamp('CREATED_AT').defaultTo(knex.fn.now());
    table.timestamp('UPDATED_AT').defaultTo(knex.fn.now());
  });
};

export const down = function (knex) {
  return knex.schema.dropTable('bangsal');
};