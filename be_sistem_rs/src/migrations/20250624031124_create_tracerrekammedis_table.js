/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('tracerrekammedis', (table) => {
    table.increments('IDTRACER').primary();
    table.string('NIK', 20).notNullable()
      .references('NIK').inTable('pasien').onDelete('CASCADE');
    table.string('LOKASITERKINI', 100);
    table.timestamp('TANGGALPINJAM').defaultTo(knex.fn.now());
    table.timestamp('TANGGALKEMBALI');
    table.enu('STATUS', ['Dipinjam', 'Dikembalikan']).defaultTo('Dipinjam');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const down = function (knex) {
  return knex.schema.dropTable('tracerrekammedis');
};
