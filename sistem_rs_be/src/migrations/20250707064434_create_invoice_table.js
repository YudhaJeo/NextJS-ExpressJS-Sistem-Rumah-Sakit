/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('invoice', (table) => {
    table.increments('IDINVOICE').primary();
    table.string('NOINVOICE', 50).unique().notNullable();
    table.string('NIK', 20).notNullable()
      .references('NIK').inTable('pasien').onDelete('CASCADE');
    table.integer('IDASURANSI').unsigned()
      .references('IDASURANSI').inTable('asuransi').onDelete('SET NULL');
    table.datetime('TANGGALINVOICE').notNullable().defaultTo(knex.fn.now());
    table.double('TOTALTAGIHAN', 15, 2).notNullable();
    table.double('TOTALDEPOSIT', 15, 2).defaultTo(0);
    table.double('TOTALANGSURAN', 15, 2).defaultTo(0);
    table.enu('STATUS', ['BELUM_LUNAS', 'LUNAS']).defaultTo('BELUM_LUNAS');
    table.timestamp('CREATED_AT').defaultTo(knex.fn.now());
    table.timestamp('UPDATED_AT').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTable('invoice');
};