// src/migrations/20250704131000_create_master_jenis_kamar.js
export const up = function (knex) {
    return knex.schema.createTable('jenis_kamar', (table) => {
      table.increments('IDJENISKAMAR').primary();
      table.string('NAMAJENIS', 50).notNullable().unique(); 
      table.decimal('HARGA_PER_HARI', 10, 2).notNullable();
      table.text('FASILITAS'); 
    });
  };
  
  export const down = function (knex) {
    return knex.schema.dropTable('jenis_kamar');
  };
  