//migrasi
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('kalender', (table) => {
    table.increments('ID').primary();
    table.integer('IDDOKTER').unsigned().notNullable()
      .references('IDDOKTER').inTable('data_dokter').onDelete('CASCADE');
    table.date('TANGGAL').notNullable().unique();
    table.enu('STATUS', ['libur', 'perjanjian']).notNullable();
    table.string('KETERANGAN', 100).notNullable();
    table.timestamp('CREATED_AT').defaultTo(knex.fn.now());
    table.timestamp('UPDATED_AT').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTable('kalender');
};
