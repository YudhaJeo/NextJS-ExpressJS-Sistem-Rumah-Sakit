export const up = function (knex) {
  return knex.schema.createTable('alkes_inap', (table) => {
      table.increments('IDALKESINAP').primary();

      table
          .integer('IDRAWATINAP')
          .unsigned()
          .notNullable()
          .references('IDRAWATINAP')
          .inTable('rawat_inap')
          .onDelete('CASCADE');

      table
          .integer('IDALKES')
          .unsigned()
          .notNullable()
          .references('IDALKES')
          .inTable('alkes')
          .onDelete('RESTRICT');

      table
          .integer('IDTENAGAMEDIS')
          .unsigned()
          .notNullable()
          .references('IDTENAGAMEDIS')
          .inTable('master_tenaga_medis')
          .onDelete('RESTRICT');

      table.dateTime('WAKTUPEMBERIAN').notNullable();

      table.integer('JUMLAH').notNullable();
      table.double('HARGA').notNullable();
      table.double('TOTAL').notNullable();
      table.timestamps(true, true);
  });
};

export const down = function (knex) {
  return knex.schema.dropTableIfExists('alkes_inap');
};
