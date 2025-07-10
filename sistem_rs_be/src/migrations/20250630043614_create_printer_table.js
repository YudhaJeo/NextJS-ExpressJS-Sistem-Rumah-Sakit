/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('printer', (table) => {
    table.increments('NOPRINTER').primary();
    table.string('NAMAPRINTER', 100).notNullable();
    table.string('KODEPRINTER', 10).unique().notNullable();
    table.enu('KETERANGAN', ['AKTIF', 'TIDAK AKTIF']).notNullable().defaultTo('AKTIF');
    table.timestamp('CREATED_AT').defaultTo(knex.fn.now());
    table.timestamp('UPDATED_AT').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTable('printer');
};