/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('data_dokter', (table) => {
    table.increments('IDDATA').primary();
    table.integer('IDDOKTER').unsigned().nullable()
         .references('IDDOKTER').inTable('dokter')
         .onDelete('SET NULL');
    table.integer('IDPOLI').unsigned()
    .references('IDPOLI').inTable('poli').onDelete('SET NULL');
    table.integer('IDJADWAL').unsigned().nullable()
    .references('IDJADWAL').inTable('jadwal_dokter').onDelete('SET NULL');
    table.string('NO_TELEPON', 20);
    table.string('EMAIL', 100).unique().notNullable();
    table.string('ALAMAT', 255);
    table.enu('JENIS_KELAMIN', ['Laki-laki', 'Perempuan']).notNullable();
    table.timestamp('CREATED_AT').defaultTo(knex.fn.now());
    table.timestamp('UPDATED_AT').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTable('data_dokter');
};
