/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('angsuran', (table) => {
    table.increments('IDANGSURAN').primary();
    table.integer('IDINVOICE').unsigned().notNullable()
      .references('IDINVOICE').inTable('invoice').onDelete('CASCADE');
    table.string('NIK', 20).notNullable()
      .references('NIK').inTable('pasien').onDelete('CASCADE');
    table.decimal('JUMLAHTOTAL', 15, 2).notNullable();
    table.decimal('JUMLAH_TERBAYAR', 15, 2).defaultTo(0);
    table.decimal('SISA_ANGSURAN', 15, 2).notNullable();
    table.decimal('JUMLAH_CICILAN', 15, 2).notNullable();
    table.datetime('TANGGAL_JATUH_TEMPO').notNullable();
    table.enu('STATUS', ['AKTIF', 'LUNAS', 'MACET']).defaultTo('AKTIF');
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