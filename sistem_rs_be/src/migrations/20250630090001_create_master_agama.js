export const up = function (knex) {
    return knex.schema.createTable('agama', (table) => {
      table.increments('IDAGAMA').primary();
      table.string('NAMAAGAMA', 50).notNullable().unique();
    });
  };
  
  export const down = function (knex) {
    return knex.schema.dropTable('agama');
  };
  