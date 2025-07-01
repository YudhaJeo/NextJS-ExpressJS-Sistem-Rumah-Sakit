// src/migrations/20250630090100_create_agama_table.js
export const up = function (knex) {
    return knex.schema.createTable('agama', (table) => {
      table.increments('IDAGAMA').primary();
      table.string('NAMAAGAMA', 50).notNullable().unique();
    });
  };
  
  export const down = function (knex) {
    return knex.schema.dropTable('agama');
  };
  