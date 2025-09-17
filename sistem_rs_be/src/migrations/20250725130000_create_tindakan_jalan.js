export const up = function (knex) {
    return knex.schema.createTable('tindakan_jalan', (table) => {
      table.increments('IDTINDAKANJALAN').primary();
      table
        .integer('IDRAWATJALAN')
        .unsigned()
        .notNullable()
        .references('IDRAWATJALAN')
        .inTable('rawat_jalan')
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
    return knex.schema.dropTableIfExists('tindakan_jalan');
  };
  
  