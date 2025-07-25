// sistem_rs_be\src\migrations\20250724100100_create_riwayat_obat_inap.js

export const up = function (knex) {
    return knex.schema.createTable('riwayat_obat_inap', (table) => {
      table.increments('IDRIWAYATOBATINAP').primary();
      table.integer('IDRIWAYATINAP').unsigned().notNullable()
        .references('IDRIWAYATINAP').inTable('riwayat_rawat_inap').onDelete('CASCADE');
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
    return knex.schema.dropTableIfExists('riwayat_obat_inap');
  };
  