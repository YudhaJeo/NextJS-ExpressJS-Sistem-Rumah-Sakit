/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('kartu_stok', (table) => {
    table.increments('IDKARTU').primary(); 
    table.integer('IDOBAT').unsigned().notNullable()
         .references('IDOBAT').inTable('obat')
         .onDelete('CASCADE');
    table.integer('IDALKES').unsigned().notNullable()
         .references('IDALKES').inTable('master_alkes')
         .onDelete('CASCADE'); 
    table.date('TANGGAL').notNullable(); 
    table.enu('JENISTRANSAKSI', ['MASUK', 'KELUAR']).notNullable(); 
    table.integer('JUMLAHOBAT').notNullable();
    table.integer('JUMLAHALKES').notNullable(); 
    table.integer('SISASTOK').notNullable(); 
    table.string('KETERANGAN', 255); 
    table.timestamp('CREATED_AT').defaultTo(knex.fn.now()); 
    table.timestamp('UPDATED_AT').defaultTo(knex.fn.now()); 
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTable('kartu_stok');
};
