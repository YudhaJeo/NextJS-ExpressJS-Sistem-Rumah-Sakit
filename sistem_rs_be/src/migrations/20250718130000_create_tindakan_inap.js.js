// src/migrations/20250718130000_create_tindakan_inap.js
export const up = function (knex) {
    return knex.schema.createTable('tindakan_inap', (table) => {
      table.increments('IDTINDAKANINAP').primary();
      table
        .integer('IDRAWATINAP')
        .unsigned()
        .notNullable()
        .references('IDRAWATINAP')
        .inTable('rawat_inap')
        .onDelete('CASCADE');
        table
        .integer('IDTINDAKAN')
        .unsigned() 
        .notNullable()
        .references('IDTINDAKAN')
        .inTable('tindakan_medis')
        .onDelete('RESTRICT');    
      table.integer('JUMLAH').notNullable();
      table.double('HARGA').notNullable();
      table.double('TOTAL').notNullable();
      table.timestamps(true, true);
    });
  };
  
  export const down = function (knex) {
    return knex.schema.dropTableIfExists('tindakan_inap');
  };
  
  