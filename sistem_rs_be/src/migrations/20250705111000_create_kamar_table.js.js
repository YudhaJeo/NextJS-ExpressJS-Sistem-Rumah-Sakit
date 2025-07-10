// src/migrations/20250705111000_create_kamar_table.js
export const up = function (knex) {
    return knex.schema.createTable('kamar', (table) => {
      table.increments('IDKAMAR').primary();
      table.string('NAMAKAMAR', 100).notNullable().unique();
      table.integer('IDBANGSAL').unsigned().notNullable()
        .references('IDBANGSAL').inTable('bangsal').onDelete('CASCADE');
      table.integer('KAPASITAS').unsigned().notNullable();
      table.text('KETERANGAN');
      table.timestamp('CREATED_AT').defaultTo(knex.fn.now());
      table.timestamp('UPDATED_AT').defaultTo(knex.fn.now());
    });
  };
  
  export const down = function (knex) {
    return knex.schema.dropTable('kamar');
  };
