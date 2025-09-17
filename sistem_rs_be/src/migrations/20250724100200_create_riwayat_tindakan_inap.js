export const up = function (knex) {
  return knex.schema.createTable('riwayat_tindakan_inap', (table) => {
    table.increments('IDRIWAYATTINDAKANINAP').primary();
    
    table.integer('IDRIWAYATINAP')
      .unsigned()
      .notNullable()
      .references('IDRIWAYATINAP')
      .inTable('riwayat_rawat_inap')
      .onDelete('CASCADE');
    
    table.integer('IDTINDAKAN')
      .unsigned()
      .notNullable()
      .references('IDTINDAKAN')
      .inTable('tindakan_medis')
      .onDelete('RESTRICT');
    
    table
      .integer('IDTENAGAMEDIS')
      .unsigned()
      .notNullable()
      .references('IDTENAGAMEDIS')
      .inTable('tindakan_inap')
      .onDelete('RESTRICT');

    table.dateTime('WAKTUPEMBERIAN').notNullable();
    
    table.integer('JUMLAH').notNullable();
    table.double('HARGA').notNullable();
    table.double('TOTAL').notNullable();

    table.timestamp('CREATED_AT').defaultTo(knex.fn.now());
    table.timestamp('UPDATED_AT').defaultTo(knex.fn.now());
  });
};

export const down = function (knex) {
  return knex.schema.dropTableIfExists('riwayat_tindakan_inap');
};
