/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('reservasi', (table) => {
    table.increments('IDRESERVASI').primary();
    table.string('NIK', 20).notNullable()
      .references('NIK').inTable('pasien').onDelete('CASCADE');
    table.string('POLI', 50);
    table.string('NAMADOKTER', 100);
    table.date('TANGGALRESERVASI').notNullable();
    table.time('JAMRESERVASI');
    table.enu('STATUS', ['Menunggu', 'Dikonfirmasi', 'Dibatalkan']).defaultTo('Menunggu');
    table.text('KETERANGAN');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const down = function (knex) {
  return knex.schema.dropTable('reservasi');
};
