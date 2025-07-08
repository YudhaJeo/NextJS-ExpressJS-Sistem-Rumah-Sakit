// src/migrations/20250704131500_create_bangsal_table.js
export const up = function (knex) {
  return knex.schema.createTable('bangsal', (table) => {
    table.increments('IDBANGSAL').primary();
    table.string('NAMABANGSAL', 100).notNullable().unique();
    table.integer('IDJENISBANGSAL').unsigned().notNullable()
      .references('IDJENISBANGSAL')
      .inTable('jenis_bangsal')
      .onDelete('CASCADE');
    table.integer('KAPASITAS').unsigned().notNullable(); 
    table.integer('TERISI').unsigned().defaultTo(0); 
    table.enu('STATUS', ['TERSEDIA', 'PENUH', 'DIBERSIHKAN']).notNullable().defaultTo('TERSEDIA');
    table.text('KETERANGAN');
  });
};

export const down = function (knex) {
  return knex.schema.dropTable('bangsal');
};
