/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('pasien', (table) => {
    table.increments('IDPASIEN').primary();
    table.string('NIK', 20).unique().notNullable();
    table.string('NAMALENGKAP', 100).notNullable();
    table.date('TANGGALLAHIR').notNullable();
    table.enu('JENISKELAMIN', ['L', 'P']).notNullable();
    table.text('ALAMAT');
    table.string('NOHP', 15);
    table.string('AGAMA', 15);
    table.string('GOLDARAH', 3);
    table.enu('ASURANSI', ['BPJS', 'Umum', 'Lainnya']);
    table.string('NOASURANSI', 30);
    table.timestamp('TANGGALDAFTAR').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const down = function (knex) {
  return knex.schema.dropTable('pasien');
};