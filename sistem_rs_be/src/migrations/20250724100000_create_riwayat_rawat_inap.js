export const up = function (knex) {
  return knex.schema.createTable('riwayat_rawat_inap', (table) => {
    table.increments('IDRIWAYATINAP').primary();

    table.integer('IDRAWATINAP').unsigned().notNullable()
      .references('IDRAWATINAP').inTable('rawat_inap').onDelete('CASCADE');

    table.string('NOMORBED', 20);

    table.date('TANGGALMASUK').notNullable();
    table.date('TANGGALKELUAR');

    table.double('TOTALKAMAR').defaultTo(0);
    table.double('TOTALOBAT').defaultTo(0);
    table.double('TOTALTINDAKAN').defaultTo(0);
    table.double('TOTALALKES').defaultTo(0);
    table.double('TOTALBIAYA').defaultTo(0);
    table.timestamp('CREATED_AT').defaultTo(knex.fn.now());
    table.timestamp('UPDATED_AT').defaultTo(knex.fn.now());
  });
};

export const down = function (knex) {
  return knex.schema.dropTableIfExists('riwayat_rawat_inap');
};
