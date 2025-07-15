// src/migrations/20250714120000_create_obat_table.js

export const up = function (knex) {
    return knex.schema.createTable('obat', (table) => {
      table.increments('IDOBAT').primary();
      table.string('NAMAOBAT', 100).notNullable().unique();
      
      table.enu('SATUAN', [
        'TABLET',
        'KAPSUL',
        'SIRUP',
        'BOTOL',
        'AMPUL',
        'TUBE',
        'BIJI'
      ]).notNullable().defaultTo('TABLET');      
      
      table.integer('STOK').unsigned().defaultTo(0);
      table.double('HARGA').notNullable();
      table.text('KETERANGAN');
  
      table.timestamp('CREATED_AT').defaultTo(knex.fn.now());
      table.timestamp('UPDATED_AT').defaultTo(knex.fn.now());
    });
  };
  
  export const down = function (knex) {
    return knex.schema.dropTable('obat');
  };
  