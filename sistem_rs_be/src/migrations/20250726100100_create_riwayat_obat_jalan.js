// sistem_rs_be\src\migrations\20250726100100_create_riwayat_obat_jalan.js

export const up = function (knex) {
  return knex.schema.createTable('riwayat_obat_jalan', (table) => {
    table.increments('IDRIWAYATOBATJALAN').primary();
    table.integer('IDRIWAYATJALAN').unsigned().notNullable()
      .references('IDRIWAYATJALAN').inTable('riwayat_rawat_jalan').onDelete('CASCADE');
    table.integer('IDOBAT').unsigned().notNullable()
      .references('IDOBAT').inTable('obat').onDelete('RESTRICT');
    table.integer('JUMLAH').notNullable();
    table.double('HARGA').notNullable();
    table.double('TOTAL').notNullable();
    table.timestamp('CREATED_AT').defaultTo(knex.fn.now());
    table.timestamp('UPDATED_AT').defaultTo(knex.fn.now());
  });
};

export const down = function (knex) {
  return knex.schema.dropTableIfExists('riwayat_obat_jalan');
};
