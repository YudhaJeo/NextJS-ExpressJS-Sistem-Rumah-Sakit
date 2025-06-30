// src/migrations/20250630090200_create_asuransi_table.js
export const up = function (knex) {
    return knex.schema.createTable('asuransi', (table) => {
      table.increments('IDASURANSI').primary();
      table.string('ASURANSI', 100).notNullable().unique();
      table.text('KETERANGAN');
    });
  };
  
  export const down = function (knex) {
    return knex.schema.dropTable('asuransi');
  };
  