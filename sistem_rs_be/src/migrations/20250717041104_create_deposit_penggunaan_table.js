/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('deposit_penggunaan', (table) => {
    table.increments('IDPENGGUNAAN').primary();
    table.integer('IDDEPOSIT').unsigned().notNullable()
      .references('IDDEPOSIT').inTable('deposit').onDelete('CASCADE');
    table.integer('IDINVOICE').unsigned().notNullable()
      .references('IDINVOICE').inTable('invoice').onDelete('CASCADE');
    table.datetime('TANGGALPEMAKAIAN').notNullable().defaultTo(knex.fn.now());
    table.double('JUMLAH_PEMAKAIAN', 15, 2).notNullable();
    table.timestamp('CREATED_AT').defaultTo(knex.fn.now());
    table.timestamp('UPDATED_AT').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTable('deposit_penggunaan');
};