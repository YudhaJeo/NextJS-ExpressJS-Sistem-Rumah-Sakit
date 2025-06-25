/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('pendaftaran', (table) => {
    table.increments('IDPENDAFTARAN').primary();
    table.integer('IDPASIEN').unsigned().notNullable();
    table.date('TANGGALDAFTAR').defaultTo(knex.fn.now());
    table.string('KETERANGAN', 255);

    // Relasi ke tabel pasien
    table.foreign('IDPASIEN').references('IDPASIEN').inTable('pasien').onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTable('pendaftaran');
};
