/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('deposit', (table) => {
    table.increments('IDDEPOSIT').primary();
    table.string('NIK', 20).notNullable()
      .references('NIK').inTable('pasien').onDelete('CASCADE');
    table.datetime('TANGGALDEPOSIT').notNullable().defaultTo(knex.fn.now());
    table.decimal('JUMLAH', 15, 2).notNullable();
    table.decimal('SISA_SALDO', 15, 2).notNullable();
    table.text('KETERANGAN');
    table.timestamp('CREATED_AT').defaultTo(knex.fn.now());
    table.timestamp('UPDATED_AT').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTable('deposit');
};