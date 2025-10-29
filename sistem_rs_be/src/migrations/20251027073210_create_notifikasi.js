// D:\MARSTECH\NextJS-ExpressJS-Final-System\sistem_rs_be\src\migrations\20251027073210_create_notifikasi.js

export const up = function (knex) {
  return knex.schema.createTable('notifikasi_user', (table) => {
    table.increments('IDNOTIFIKASI').primary();
    table.string('NIK', 20).notNullable();
    table.foreign('NIK')
      .references('NIK')
      .inTable('pasien')
      .onDelete('CASCADE');

    table.datetime('TANGGALRESERVASI').notNullable();
    table.text('JUDUL').notNullable();
    table.text('PESAN').notNullable();

    table.integer('IDPOLI').unsigned()
      .references('IDPOLI').inTable('poli').onDelete('SET NULL');
    table.integer('IDDOKTER').unsigned()
      .references('IDDOKTER').inTable('dokter').onDelete('SET NULL');

    table.boolean('STATUS').notNullable().defaultTo(false);

    table.timestamp('CREATED_AT').defaultTo(knex.fn.now());
    table.timestamp('UPDATED_AT').defaultTo(knex.fn.now());
  });
};

export const down = function (knex) {
  return knex.schema.hasTable('notifikasi_user').then((exists) => {
    if (exists) {
      return knex.schema.dropTable('notifikasi_user');
    }
  });
};
