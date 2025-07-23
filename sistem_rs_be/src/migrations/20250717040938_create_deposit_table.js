/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('deposit', (table) => {
    table.increments('IDDEPOSIT').primary();
    table.string('NODEPOSIT', 50).notNullable().unique();
    table.string('NIK', 20).notNullable()
      .references('NIK').inTable('pasien').onDelete('CASCADE');
    table.datetime('TANGGALDEPOSIT').notNullable().defaultTo(knex.fn.now());
    table.double('NOMINAL', 15, 2).notNullable();
    table.string('METODE', 50).notNullable();
    table.integer('IDBANK').unsigned()
      .references('IDBANK').inTable('bank_account').onDelete('SET NULL');
    table.double('SALDO_SISA', 15, 2).notNullable();
    table.enu('STATUS', ['AKTIF', 'HABIS', 'REFUND']).defaultTo('AKTIF');
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
  return knex.schema.table('deposit', (table) => {
    table.dropColumn('IDBANK');
  });
};