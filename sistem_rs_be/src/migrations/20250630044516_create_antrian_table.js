/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('antrian', (table) => {
    table.increments('ID').primary();
    table.string('NO_ANTRIAN').notNullable();
    table.integer('LOKET_ID').unsigned().notNullable()
      .references('NO').inTable('loket').onDelete('CASCADE');
    table.string('STATUS').defaultTo('Belum');
    table.timestamp('CREATED_AT').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTable('antrian');
};
