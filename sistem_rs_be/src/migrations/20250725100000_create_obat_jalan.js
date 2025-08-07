// src/migrations/20250715130000_create_obat_jalan.js
export const up = function (knex) {
  return knex.schema.createTable('obat_jalan', (table) => {
    table.increments('IDOBATJALAN').primary();
    table
      .integer('IDRAWATJALAN')
      .unsigned()
      .notNullable()
      .references('IDRAWATJALAN')
      .inTable('rawat_jalan')
      .onDelete('CASCADE');
      table
      .integer('IDOBAT')
      .unsigned() 
      .notNullable()
      .references('IDOBAT')
      .inTable('obat')
      .onDelete('RESTRICT');    
    table.integer('JUMLAH').notNullable();
    table.double('HARGA').notNullable();
    table.double('TOTAL').notNullable();
    table.timestamps(true, true);
  });
};

export const down = function (knex) {
  return knex.schema.dropTableIfExists('obat_jalan');
};

