// src/migrations/20250714120000_create_alkes_table.js
export const up = function (knex) {
  return knex.schema.createTable('alkes', (table) => {
    table.increments('IDALKES').primary(); 
    table.string('KODEALKES', 50).notNullable().unique();
    table.string('NAMAALKES', 100).notNullable().unique();
    table.string('MERKALKES', 50).notNullable();
    table.enu('JENISALKES', [
      'TERAPI',
      'DIAGNOSTIK',
      'PENUNJANG',
      'KEBERSIHAN',
      'CHECKUP',
      'LAINNYA'
    ]).notNullable().defaultTo('LAINNYA');       
    table.integer('STOK').unsigned().defaultTo(0);
    table.double('HARGABELI').notNullable();
    table.double('HARGAJUAL').notNullable();
    table.string('TGLKADALUARSA', 50).notNullable();
    table.string('LOKASI', 50).notNullable();
    table.integer("SUPPLIERID").unsigned().references("SUPPLIERID").inTable("master_supplier").onDelete("SET NULL").onUpdate("CASCADE");
    table.text('DESKRIPSI').nullable();
    table.timestamp('CREATED_AT').defaultTo(knex.fn.now());
    table.timestamp('UPDATED_AT').defaultTo(knex.fn.now());
  });
};

export const down = function (knex) {
  return knex.schema.dropTable('alkes');
};