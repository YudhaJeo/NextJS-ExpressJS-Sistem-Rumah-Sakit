// src/migrations/20250630090200_create_master_poli_table.js
export const up = function (knex) {
    return knex.schema.createTable('poli', (table) => {
      table.increments('IDPOLI').primary();
      table.string('NAMAPOLI', 100).notNullable().unique();
    });
};

export const down = function (knex) {
    return knex.schema.dropTable('poli');
};
