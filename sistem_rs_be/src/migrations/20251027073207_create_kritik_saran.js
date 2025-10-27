export const up = function (knex) {
  return knex.schema.createTable('kritik_saran', (table) => {
    table.increments('IDKRITIKSARAN').primary();
    table.string('NIK', 20).nullable();
    table.foreign('NIK')
      .references('NIK').inTable('pasien').onDelete('SET NULL');
    table.enum('JENIS', ['Pelayanan', 'Fasilitas', 'Dokter', 'Perawat', 'Lainnya']).notNullable();
    table.text('PESAN').notNullable();

    table.timestamp('CREATED_AT').defaultTo(knex.fn.now());
    table.timestamp('UPDATED_AT').defaultTo(knex.fn.now());
  });
};

export const down = function (knex) {
  return knex.schema.hasTable('kritik_saran').then((exists) => {
    if (exists) {
      return knex.schema.dropTable('kritik_saran');
    }
  });
};
