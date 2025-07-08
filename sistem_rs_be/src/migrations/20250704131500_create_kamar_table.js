// src/migrations/20250704131500_create_kamar_table.js
export const up = function (knex) {
    return knex.schema.createTable('kamar', (table) => {
      table.increments('IDKAMAR').primary();
      table.string('NAMAKAMAR', 100).notNullable().unique();
      table.integer('IDJENISKAMAR').unsigned().notNullable()
        .references('IDJENISKAMAR')
        .inTable('jenis_kamar')
        .onDelete('CASCADE');
      table.integer('KAPASITAS').unsigned().notNullable(); 
      table.integer('TERISI').unsigned().defaultTo(0); 
      table.enu('STATUS', ['TERSEDIA', 'PENUH', 'DIBERSIHKAN']).notNullable().defaultTo('TERSEDIA');
      table.text('KETERANGAN');
    });
  };
  
  export const down = function (knex) {
    return knex.schema.dropTable('kamar');
  };
  