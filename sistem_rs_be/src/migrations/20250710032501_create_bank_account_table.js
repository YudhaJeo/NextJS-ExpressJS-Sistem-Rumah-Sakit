/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('bank_account', (table) => {
    table.increments('IDBANK').primary();
    table.string('NAMA_BANK', 50).notNullable();
    table.string('NO_REKENING', 30).notNullable();
    table.string('ATAS_NAMA', 100).notNullable();
    table.string('CABANG', 100);
    table.string('KODE_BANK', 10);
    table.enu('STATUS', ['AKTIF', 'NONAKTIF']).defaultTo('AKTIF').notNullable();
    table.text('CATATAN');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTable('bank_account');
};