export const up = function (knex) {
  return knex.schema.createTable('riwayat_kunjungan', (table) => {
    table.increments('IDRIWAYATKUNJUNGAN').primary();

    table.string('NIK').notNullable()
      .references('NIK').inTable('pasien').onDelete('CASCADE');

    table.enu('JENIS', ['RAWAT JALAN', 'RAWAT INAP']).notNullable();

    table.integer('IDRIWAYATJALAN').unsigned().nullable()
      .references('IDRIWAYATJALAN').inTable('riwayat_rawat_jalan').onDelete('CASCADE');

    table.integer('IDRIWAYATINAP').unsigned().nullable()
      .references('IDRIWAYATINAP').inTable('riwayat_rawat_inap').onDelete('CASCADE');

    table.timestamp('TANGGAL').notNullable().defaultTo(knex.fn.now());

    table.timestamp('CREATED_AT').defaultTo(knex.fn.now());
    table.timestamp('UPDATED_AT').defaultTo(knex.fn.now());
  });
};

export const down = function (knex) {
  return knex.schema.dropTableIfExists('riwayat_kunjungan');
};