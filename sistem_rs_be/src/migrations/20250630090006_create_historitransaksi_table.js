/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('historitransaksi', (table) => {
    table.increments('IDTRANSAKSI').primary();
    table.string('NIK', 20).notNullable()
      .references('NIK').inTable('pasien').onDelete('CASCADE');
    table.timestamp('TANGGAL').defaultTo(knex.fn.now());
    table.string('JENISTRANSAKSI', 100);
    table.text('KETERANGAN');
    table.timestamp('CREATED_AT').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('UPDATED_AT').defaultTo(knex.fn.now()).notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const down = function (knex) {
  return knex.schema.dropTable('historitransaksi');
};
