/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('loket', (table) => {
    table.increments('NO').primary(); 
    table.string('NAMALOKET', 100).notNullable();
    table.string('KODE', 10).unique().notNullable();
    table.string('DESKRIPSI', 255);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTable('loket');
};