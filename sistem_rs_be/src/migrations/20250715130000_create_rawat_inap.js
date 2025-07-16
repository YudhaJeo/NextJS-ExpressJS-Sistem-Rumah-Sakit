// src/migrations/20250715130000_create_rawat_inap.js

export const up = function (knex) {
    return knex.schema.createTable('rawat_inap', (table) => {
      table.increments('IDRAWATINAP').primary();
      table.integer('IDPASIEN').unsigned().notNullable()
        .references('IDPASIEN').inTable('pasien').onDelete('CASCADE');
      table.integer('IDBED').unsigned().notNullable()
        .references('IDBED').inTable('bed').onDelete('CASCADE');
      table.date('TANGGALMASUK').notNullable();
      table.date('TANGGALKELUAR');
      table.enu('STATUS', ['AKTIF', 'SELESAI']).notNullable().defaultTo('AKTIF');
      table.text('CATATAN');
      table.timestamp('CREATED_AT').defaultTo(knex.fn.now());
      table.timestamp('UPDATED_AT').defaultTo(knex.fn.now());
    });
  };
  
  export const down = function (knex) {
    return knex.schema.dropTable('rawat_inap');
  };
  