/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('metode_pembayaran', (table) => {
    table.increments('IDMETODE').primary(); 
    table.string('NAMA', 50).notNullable();
    table.decimal('FEE_PERSEN', 5, 2).defaultTo(0); 
    table.enu('STATUS', ['AKTIF', 'NONAKTIF']).defaultTo('AKTIF').notNullable(); 
    table.text('KETERANGAN');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTable('metode_pembayaran');
};