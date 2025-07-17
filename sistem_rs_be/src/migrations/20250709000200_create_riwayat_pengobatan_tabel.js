/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('riwayat_pengobatan', (table) => {
    table.increments('IDPENGOBATAN').primary();
    table.integer('IDPENDAFTARAN').unsigned().notNullable()
      .references('IDPENDAFTARAN').inTable('pendaftaran').onDelete('CASCADE').notNullable();
    table.string('NIK', 20).notNullable()
      .references('NIK').inTable('pendaftaran').onDelete('CASCADE');
    table.datetime('TANGGALKUNJUNGAN').notNullable();
    table.string('KELUHAN', 255).nullable();
    table.integer('IDDOKTER').unsigned().notNullable()
      .references('IDDOKTER').inTable('dokter').onDelete('CASCADE');
    table.integer('IDPOLI').unsigned().notNullable()
      .references('IDPOLI').inTable('poli').onDelete('CASCADE');
    table.enu('STATUSKUNJUNGAN', ['Diperiksa', 'Batal', 'Selesai']).defaultTo('Diperiksa');
    table.enu('STATUSRAWAT', ['Rawat Jalan', 'Rawat Inap']).defaultTo('Rawat Jalan');
    table.string('DIAGNOSA', 255).nullable();
    table.string('OBAT', 255).nullable();
    table.timestamp('CREATED_AT').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('UPDATED_AT').defaultTo(knex.fn.now()).notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const down = function (knex) {
  return knex.schema.dropTable('riwayat_pengobatan');
};