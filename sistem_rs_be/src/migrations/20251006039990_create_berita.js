// D:\MARSTECH\NextJS-ExpressJS-Final-System\sistem_rs_be\src\migrations\20251006039990_create_berita.js
export const up = function (knex) {
  return knex.schema.createTable('berita', (table) => {
    table.increments('IDBERITA').primary();
    table.string('JUDUL', 100).notNullable();
    table.string('DESKRIPSISINGKAT', 255).notNullable();
    table.string('PRATINJAU', 255).notNullable();
    table.text('URL');
    table.timestamp('CRAETED_AT').defaultTo(knex.fn.now());
    table.timestamp('UPDATED_AT').defaultTo(knex.fn.now());
  });
};

export const down = function (knex) {
  return knex.schema.hasTable('berita').then((exists) => {
    if (exists) {
      return knex.schema.dropTable('berita');
    }
  });
};
