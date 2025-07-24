/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('pendaftaran', (table) => {
    table.increments('IDPENDAFTARAN').primary();
    table.string('NIK', 20).notNullable()
      .references('NIK').inTable('pasien').onDelete('CASCADE');
    table.datetime('TANGGALKUNJUNGAN').notNullable();
    table.string('KELUHAN', 255).nullable();
    table.integer('IDPOLI').unsigned().notNullable()
      .references('IDPOLI').inTable('poli').onDelete('CASCADE');
    table.enu('STATUSKUNJUNGAN', ['Diperiksa', 'Batal', 'Selesai', 'Dalam Antrian']).defaultTo('Dalam Antrian');
    table.timestamp('CREATED_AT').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('UPDATED_AT').defaultTo(knex.fn.now()).notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const down = function (knex) {
  return knex.schema.dropTable('pendaftaran');
};