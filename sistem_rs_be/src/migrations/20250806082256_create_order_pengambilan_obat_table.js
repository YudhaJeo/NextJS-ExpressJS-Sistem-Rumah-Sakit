/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('order_pengambilan_header', (table) => {
    table.increments('IDORDER').primary();
    table.integer('IDPASIEN').unsigned().notNullable()
      .references('IDPASIEN').inTable('pasien').onDelete('RESTRICT').onUpdate('CASCADE');
    table.date('TANGGALPENGAMBILAN').notNullable();
    table.string('KETERANGAN', 255);
    table.enum('STATUS_PEMBAYARAN', ['BELUM_BAYAR', 'LUNAS', 'DIBATALKAN'])
      .notNullable().defaultTo('BELUM_BAYAR');
    table.enum('STATUS_PENGAMBILAN', ['MENUNGGU', 'SELESAI', 'BATAL'])
      .notNullable().defaultTo('MENUNGGU');
    table.timestamp('CREATED_AT').defaultTo(knex.fn.now());
    table.timestamp('UPDATED_AT').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('order_pengambilan_detail', (table) => {
    table.increments('IDDETAIL').primary();
    table.integer('IDORDER').unsigned().notNullable()
      .references('IDORDER').inTable('order_pengambilan_header').onDelete('CASCADE').onUpdate('CASCADE');
    table.enum('JENISBARANG', ['OBAT', 'ALKES']).notNullable();
    table.integer('IDBARANG').unsigned().notNullable();
    table.integer('IDKARTU').unsigned().notNullable()
      .references('IDKARTU').inTable('kartu_stok').onDelete('RESTRICT').onUpdate('CASCADE');
    table.integer('JUMLAH').notNullable();
    table.string('KETERANGAN', 255);
    table.timestamp('CREATED_AT').defaultTo(knex.fn.now());
    table.timestamp('UPDATED_AT').defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists('order_pengambilan_detail');
  await knex.schema.dropTableIfExists('order_pengambilan_header');
}