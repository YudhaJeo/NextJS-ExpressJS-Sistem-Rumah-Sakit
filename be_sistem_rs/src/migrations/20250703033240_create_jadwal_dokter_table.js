export const up = function (knex) {
  return knex.schema.createTable('jadwal_dokter', (table) => {
    table.increments('IDJADWAL').primary();
    table
      .integer('IDDOKTER')
      .unsigned()
      .notNullable()
      .references('IDDOKTER')
      .inTable('dokter')
      .onDelete('CASCADE');
    table.string('HARI', 10).notNullable(); // Senin–Jumat
    table.string('JAM_MULAI', 5).notNullable(); // 08:00
    table.string('JAM_SELESAI', 5).notNullable(); // 10:00
  });
};

export const down = function (knex) {
  return knex.schema.dropTable('jadwal_dokter');
};
