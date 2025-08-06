// src/migrations/20250715120000_create_tindakan_medis.js

export const up = function (knex) {
  return knex.schema.createTable('tindakan_medis', (table) => {
    table.increments('IDTINDAKAN').primary();
    table.string('NAMATINDAKAN', 100).notNullable();
    table.double('HARGA').notNullable();
    table.enu('JENISRAWAT', ['INAP', 'JALAN']).notNullable();
    table.enu('KATEGORI', ['OPERASI', 'PERAWATAN', 'DIAGNOSTIK', 'LAINNYA']).notNullable();
    table.text('DESKRIPSI');
    table.timestamp('CREATED_AT').defaultTo(knex.fn.now());
    table.timestamp('UPDATED_AT').defaultTo(knex.fn.now());
  });
};

export const down = function (knex) {
  return knex.schema.dropTable('tindakan_medis');
};