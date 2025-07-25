// sistem_rs_be\src\migrations\20250724100200_create_riwayat_tindakan_inap.js

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
