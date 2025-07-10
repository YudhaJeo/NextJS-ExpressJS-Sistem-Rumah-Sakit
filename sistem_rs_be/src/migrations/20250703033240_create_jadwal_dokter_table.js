export const up = function (knex) {
  return knex.schema.createTable('jadwal_dokter', (table) => {
    table.increments('IDJADWAL').primary();
    table.integer('IDDOKTER').unsigned().notNullable()
      .references('IDDOKTER').inTable('dokter').onDelete('CASCADE');
    table.string('HARI', 10).notNullable(); 
    table.time('JAM_MULAI', 5).notNullable(); 
    table.time('JAM_SELESAI', 5).notNullable();
    table.timestamp('CREATED_AT').defaultTo(knex.fn.now());
    table.timestamp('UPDATED_AT').defaultTo(knex.fn.now());
  });
};

export const down = function (knex) {
  return knex.schema.dropTable('jadwal_dokter');
};