/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function (knex) {
  await knex.schema.alterTable('invoice', (table) => {
    table
      .integer('IDRIWAYATINAP')
      .unsigned()
      .nullable()
      .references('IDRIWAYATINAP')
      .inTable('riwayat_rawat_inap')
      .onDelete('SET NULL');

    table
      .integer('IDRIWAYATJALAN')
      .unsigned()
      .nullable()
      .references('IDRIWAYATJALAN')
      .inTable('riwayat_rawat_jalan')
      .onDelete('SET NULL');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async function (knex) {
  await knex.schema.alterTable('invoice', (table) => {
    table.dropForeign(['IDRIWAYATINAP']);
    table.dropForeign(['IDRIWAYATJALAN']);
    table.dropColumn('IDRIWAYATINAP');
    table.dropColumn('IDRIWAYATJALAN');
  });
};
