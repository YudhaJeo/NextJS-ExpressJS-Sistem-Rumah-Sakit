export const up = function (knex) {
    return knex.schema.createTable('poli', (table) => {
      table.increments('IDPOLI').primary();
      table.string('NAMAPOLI', 100).notNullable().unique();
      table.string('KODE', 10).notNullable().unique();
      table.string('ZONA', 10).notNullable();
    });
};

export const down = function (knex) {
    return knex.schema.dropTable('poli');
};
