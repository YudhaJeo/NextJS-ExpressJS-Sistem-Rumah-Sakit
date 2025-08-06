/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('rawat_jalan', (table) => {
    table.increments('IDRAWATJALAN').primary();
    table.integer('IDDOKTER').unsigned().notNullable()
      .references('IDDOKTER').inTable('dokter').onDelete('CASCADE');
    table.integer('IDPENDAFTARAN').unsigned().notNullable()
      .references('IDPENDAFTARAN').inTable('pendaftaran').onDelete('CASCADE');
    table.enu('STATUSKUNJUNGAN', ['Diperiksa', 'Batal', 'Selesai', 'Dalam Antrian']).defaultTo('Dalam Antrian');
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
  return knex.schema.dropTable('rawat_jalan');
};

