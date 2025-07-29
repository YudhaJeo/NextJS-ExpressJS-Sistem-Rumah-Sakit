/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('angsuran', (table) => {
    table.increments('IDANGSURAN').primary();
    table.string('NOANGSURAN', 30).notNullable().unique();
    table.integer('IDINVOICE').unsigned().notNullable()
      .references('IDINVOICE').inTable('invoice').onDelete('CASCADE');
    table.double('NOMINAL', 15, 2).notNullable();
    table.datetime('TANGGALBAYAR').notNullable().defaultTo(knex.fn.now());
    table.string('METODE', 50).notNullable();
    table.integer('IDBANK').unsigned()
      .references('IDBANK').inTable('bank_account').onDelete('SET NULL');
    table.string('KETERANGAN', 255);
    table.timestamp('CREATED_AT').defaultTo(knex.fn.now());
    table.timestamp('UPDATED_AT').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTable('angsuran');
};