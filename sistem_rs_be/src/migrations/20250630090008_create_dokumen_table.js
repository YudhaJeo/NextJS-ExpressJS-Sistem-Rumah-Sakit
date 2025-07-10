/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('dokumen', (table) => {
    table.increments('IDDOKUMEN').primary();
    table.string('NIK', 20).notNullable()
      .references('NIK').inTable('pasien').onDelete('CASCADE');
    table.string('NAMAFILE', 100).notNullable();
    table.string('JENISDOKUMEN', 50);
    table.string('LOKASIFILE', 255);
    table.datetime('TANGGALUPLOAD').defaultTo(knex.fn.now());
    table.timestamp('CREATED_AT').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('UPDATED_AT').defaultTo(knex.fn.now()).notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const down = function (knex) {
  return knex.schema.dropTable('dokumen');
};
