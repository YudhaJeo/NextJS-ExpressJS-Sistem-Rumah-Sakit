/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('penjualan', (table) => {
    table.increments('IDPENJUALAN').primary();
    table.integer('IDORDER').unsigned()
      .references('IDORDER').inTable('order_pengambilan_header')
      .onDelete('SET NULL').onUpdate('CASCADE');
    table.date('TGLPENJUALAN').notNullable();
    table.double('TOTAL').notNullable();
    table.enum('STATUS', ['LUNAS', 'BELUM_LUNAS']).defaultTo('LUNAS');
    table.timestamp('CREATED_AT').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('penjualan_detail', (table) => {
    table.increments('IDDETAIL').primary();
    table.integer('IDPENJUALAN').unsigned()
      .references('IDPENJUALAN').inTable('penjualan')
      .onDelete('CASCADE').onUpdate('CASCADE');
    table.integer('IDORDERDETAIL').unsigned()
      .references('IDDETAIL').inTable('order_pengambilan_detail')
      .onDelete('SET NULL').onUpdate('CASCADE');
    table.integer('IDOBAT').unsigned()
      .references('IDOBAT').inTable('obat')
      .onDelete('SET NULL').onUpdate('CASCADE');
    table.integer('QTY').notNullable();
    table.double('HARGA').notNullable();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists('penjualan_detail');
  await knex.schema.dropTableIfExists('penjualan');
}