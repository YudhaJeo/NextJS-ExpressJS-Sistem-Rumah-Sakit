/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('jadwal_praktek', (table) => {
    table.increments('ID').primary();
    table.integer('IDDOKTER').unsigned().notNullable()
      .references('IDDOKTER').inTable('data_dokter').onDelete('CASCADE');
    table.string('POLI', 20).notNullable;
    table.string('HARI', 20).notNullable();
    table.time('JAM_MULAI').notNullable();
    table.time('JAM_SELESAI').notNullable();
    table.timestamp('CREATED_AT').defaultTo(knex.fn.now());
    table.timestamp('UPDATED_AT').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTable('jadwal_praktek');
};
