/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('data_dokter', (table) => {
    table.increments('IDDOKTER').primary();
    table.string('NAMA_DOKTER', 100).notNullable();
    table.integer('IDPOLI').unsigned()
      .references('IDPOLI').inTable('poli').onDelete('SET NULL');
    table.string('JADWALPRAKTEK', 100).notNullable();
    table.string('NO_TELEPON', 20);
    table.string('EMAIL', 100).unique().notNullable();
    table.string('ALAMAT', 255);
    table.enu('JENIS_KELAMIN', ['Laki-laki', 'Perempuan']).notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTable('data_dokter');
};
