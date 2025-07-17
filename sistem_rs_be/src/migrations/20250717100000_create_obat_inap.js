// src/migrations/20250715130000_create_obat_inap.js
export const up = function (knex) {
  return knex.schema.createTable('obat_inap', (table) => {
    table.increments('IDOBATINAP').primary();
    table
      .integer('IDRAWATINAP')
      .unsigned()
      .notNullable()
      .references('IDRAWATINAP')
      .inTable('rawat_inap')
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
  return knex.schema.dropTableIfExists('obat_inap');
};

