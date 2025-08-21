// src/migrations/20250714120000_create_obat_table.js
export const up = function (knex) {
    return knex.schema.createTable('obat', (table) => {
      table.increments('IDOBAT').primary(); 
      table.string('KODEOBAT', 50).notNullable().unique();
      table.string('NAMAOBAT', 100).notNullable().unique();
      table.string('MERKOBAT', 50).notNullable();
      table.enu('JENISOBAT', [
        'TABLET',
        'KAPSUL',
        'SIRUP',
        'OLES',
        'LARUTAN',
        'PUYER',
        'PIL',
        'LAINNYA'
      ]).notNullable().defaultTo('TABLET');      
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
    return knex.schema.dropTable('obat');
  };