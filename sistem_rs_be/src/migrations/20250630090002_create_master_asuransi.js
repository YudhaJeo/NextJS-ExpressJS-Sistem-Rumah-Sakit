export const up = function (knex) {
    return knex.schema.createTable('asuransi', (table) => {
      table.increments('IDASURANSI').primary();
      table.string('NAMAASURANSI', 100).notNullable().unique();
      table.text('KETERANGAN');
    });
  };
  
  export const down = function (knex) {
    return knex.schema.dropTable('asuransi');
  };
  