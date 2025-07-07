/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('pembayaran', (table) => {
    table.increments('IDPEMBAYARAN').primary();
    table.integer('IDINVOICE').unsigned().notNullable()
      .references('IDINVOICE').inTable('invoice').onDelete('CASCADE');
    table.string('NIK', 20).notNullable()
      .references('NIK').inTable('pasien').onDelete('CASCADE');
    table.integer('IDASURANSI').unsigned()
      .references('IDASURANSI').inTable('asuransi').onDelete('SET NULL');
    table.datetime('TANGGALBAYAR').notNullable().defaultTo(knex.fn.now());
    table.string('METODEPEMBAYARAN', 50).notNullable();
    table.double('JUMLAHBAYAR', 15, 2).notNullable();
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
  return knex.schema.dropTable('pembayaran');
};