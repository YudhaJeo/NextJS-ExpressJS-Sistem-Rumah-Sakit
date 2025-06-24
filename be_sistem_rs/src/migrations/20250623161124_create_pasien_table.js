/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('pasien', (table) => {
    table.increments('ID').primary();
    table.string('NAMA', 100).notNullable();
    table.string('NIK', 20).notNullable();
    table.date('TGLLAHIR');
    table.enu('JK', ['L', 'P']);
    table.text('ALAMAT');
    table.string('NOHP', 20);
    table.string('EMAIL', 100);
    table.timestamp('CREATEDAT').defaultTo(knex.fn.now());
    table.timestamp('UPDATEDAT').defaultTo(knex.fn.now());
  });
};

export const down = function (knex) {
  return knex.schema.dropTable('pasien');
};
