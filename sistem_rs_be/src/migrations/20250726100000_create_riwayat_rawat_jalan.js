export const up = function (knex) {
  return knex.schema.createTable('riwayat_rawat_jalan', (table) => {
    table.increments('IDRIWAYATJALAN').primary();

    table.integer('IDRAWATJALAN').unsigned().notNullable()
      .references('IDRAWATJALAN').inTable('rawat_jalan').onDelete('CASCADE');
    
    table.integer('IDDOKTER').unsigned().notNullable()
      .references('IDDOKTER').inTable('dokter').onDelete('CASCADE');

    table.string('DIAGNOSA', 255).nullable();
    table.double('TOTALTINDAKAN').defaultTo(0);
    table.double('TOTALBIAYA').defaultTo(0);
    table.timestamp('TANGGALRAWAT').notNullable().defaultTo(knex.fn.now());

    table.timestamp('CREATED_AT').defaultTo(knex.fn.now());
    table.timestamp('UPDATED_AT').defaultTo(knex.fn.now());
  });
};

export const down = function (knex) {
  return knex.schema.dropTableIfExists('riwayat_rawat_jalan');
};
