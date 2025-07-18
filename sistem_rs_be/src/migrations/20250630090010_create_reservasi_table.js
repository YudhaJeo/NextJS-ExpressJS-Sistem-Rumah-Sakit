/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('reservasi', (table) => {
    table.increments('IDRESERVASI').primary();

    table.string('NIK', 20).notNullable()
      .references('NIK').inTable('pasien').onDelete('CASCADE');
    table.integer('IDPOLI').unsigned()
      .references('IDPOLI').inTable('poli').onDelete('SET NULL');
    table.integer('IDDOKTER').unsigned()
      .references('IDDOKTER').inTable('dokter').onDelete('SET NULL');
    table.datetime('TANGGALRESERVASI').notNullable();
    table.string('JADWALPRAKTEK', 100).notNullable;
    table.enu('STATUS', ['Menunggu', 'Dikonfirmasi', 'Dibatalkan']).defaultTo('Menunggu');
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
  return knex.schema.dropTable('reservasi');
};
