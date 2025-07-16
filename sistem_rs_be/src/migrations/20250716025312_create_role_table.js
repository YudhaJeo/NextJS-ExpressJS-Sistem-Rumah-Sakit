/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('role', function (table) {
    table.increments('IDROLE').primary();
    table.string('NAMAROLE', 50).notNullable();
    table.enum('JENISROLE', ['Tenaga Medis', 'Non Medis']).notNullable();
    table.text('KETERANGAN');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTable('role');
};