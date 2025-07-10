/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('metode_pembayaran', (table) => {
    table.increments('IDMETODE').primary();
    table.integer('IDBANK').unsigned()
      .references('IDBANK').inTable('bank_account').onDelete('SET NULL'); 
    table.string('NAMA', 50).notNullable(); 
    table.enu('TIPE', ['Tunai', 'Transfer Bank', 'QRIS', 'Kartu Kredit', 'E-Wallet']).notNullable();
    table.decimal('FEE_PERSEN', 5, 2).defaultTo(0); 
    table.enu('STATUS', ['AKTIF', 'NONAKTIF']).defaultTo('AKTIF').notNullable(); 
    table.text('CATATAN');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTable('metode_pembayaran');
};