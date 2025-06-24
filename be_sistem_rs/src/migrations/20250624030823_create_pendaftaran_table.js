/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('pendaftaran', (table) => {
    table.increments('IDPENDAFTARAN').primary();
    table.string('NIK', 20).notNullable()
      .references('NIK').inTable('pasien').onDelete('CASCADE');
    table.date('TANGGALKUNJUNGAN').notNullable();
    table.enu('LAYANAN', ['Rawat Jalan', 'Rawat Inap', 'IGD']).notNullable();
    table.string('POLI', 50);
    table.string('NAMADOKTER', 100);
    table.enu('STATUSKUNJUNGAN', ['Diperiksa', 'Batal', 'Selesai']).defaultTo('Diperiksa');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const down = function (knex) {
  return knex.schema.dropTable('pendaftaran');
};
