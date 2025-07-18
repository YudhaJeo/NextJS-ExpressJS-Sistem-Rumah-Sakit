export const up = function (knex) {
  return knex.schema.createTable('komisi_dokter', (table) => {
    table.increments('IDKOMISI').primary();
    table.integer('IDPENGOBATAN').unsigned().notNullable()
      .references('IDPENGOBATAN').inTable('riwayat_pengobatan').onDelete('CASCADE');
    table.decimal('NILAIKOMISI', 10, 2).notNullable();
    table.enu('STATUS', ['Belum Dibayar', 'Sudah Dibayar']).defaultTo('Belum Dibayar');
    table.text('KETERANGAN').notNullable();
    table.timestamp('CREATED_AT').defaultTo(knex.fn.now());
    table.timestamp('UPDATED_AT').defaultTo(knex.fn.now());
  });
};


export const down = function (knex) {
  return knex.schema.dropTable('komisi_dokter');
};