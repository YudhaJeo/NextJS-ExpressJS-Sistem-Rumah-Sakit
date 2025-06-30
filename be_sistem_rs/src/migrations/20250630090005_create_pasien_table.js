// src/migrations/20250624030425_create_pasien_table.js
export const up = function (knex) {
  return knex.schema.createTable('pasien', (table) => {
    table.increments('IDPASIEN').primary();
    table.string('NIK', 20).unique().notNullable();
    table.string('NAMALENGKAP', 100).notNullable();
    table.date('TANGGALLAHIR').notNullable();
    table.enu('JENISKELAMIN', ['L', 'P']).notNullable();
    table.text('ALAMAT');
    table.string('NOHP', 15);

    table.integer('IDAGAMA').unsigned().references('IDAGAMA').inTable('agama').onDelete('SET NULL');
    table.string('GOLDARAH', 3);

    table.integer('IDASURANSI').unsigned().references('IDASURANSI').inTable('asuransi').onDelete('SET NULL');
    table.string('NOASURANSI', 30);

    table.timestamp('TANGGALDAFTAR').defaultTo(knex.fn.now());
  });
};

export const down = function (knex) {
  return knex.schema.dropTable('pasien');
};
