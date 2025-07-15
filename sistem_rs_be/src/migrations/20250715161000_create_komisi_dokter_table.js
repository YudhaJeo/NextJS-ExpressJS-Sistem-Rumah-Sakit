export const up = function (knex) {
  return knex.schema.createTable('komisi_dokter', (table) => {
    table.increments('IDKOMISI').primary();
    table.integer('IDDOKTER').unsigned().notNullable()
      .references('IDDOKTER').inTable('dokter').onDelete('CASCADE');
    table.datetime('TANGGAL_LAYANAN').notNullable();
    table.string('NAMA_LAYANAN', 100).notNullable();
    table.decimal('BIAYA_LAYANAN', 12, 2).notNullable();
    table.decimal('PERSENTASE_KOMISI', 5, 2).notNullable();
    table.decimal('NILAI_KOMISI', 12, 2).notNullable();
    table.enu('STATUS', ['belum_dibayar', 'sudah_dibayar']).defaultTo('belum_dibayar');
    table.datetime('TANGGAL_PEMBAYARAN').notNullable();
    table.text('KETERANGAN');
    table.timestamp('CREATED_AT').defaultTo(knex.fn.now());
    table.timestamp('UPDATED_AT').defaultTo(knex.fn.now());
  });
};

export const down = function (knex) {
  return knex.schema.dropTable('komisi_dokter');
};