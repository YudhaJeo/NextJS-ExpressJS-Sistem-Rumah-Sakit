/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('pemesanan', (table) => {
    table.increments('IDPEMESANAN').primary();
    table.string('TGLPEMESANAN').notNullable();
    table.enum('STATUS', ['PENDING', 'DITERIMA', 'DIBATALKAN']).defaultTo('PENDING');
    table.integer('SUPPLIERID').unsigned()
      .references('SUPPLIERID').inTable('master_supplier')
      .onDelete('SET NULL');
    table.timestamp('CREATED_AT').defaultTo(knex.fn.now());
    table.timestamp('UPDATED_AT').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('pemesanan_detail', (table) => {
    table.increments('IDDETAIL').primary();
    table.integer('IDPEMESANAN').unsigned().references('IDPEMESANAN').inTable('pemesanan').onDelete('CASCADE');
    table.enum('JENISBARANG', ['OBAT', 'ALKES']).notNullable();
    table.integer('IDBARANG').unsigned().notNullable();
    table.integer('QTY').unsigned().notNullable();
    table.double('HARGABELI').notNullable();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists('pemesanan_detail');
  await knex.schema.dropTableIfExists('pemesanan');
}