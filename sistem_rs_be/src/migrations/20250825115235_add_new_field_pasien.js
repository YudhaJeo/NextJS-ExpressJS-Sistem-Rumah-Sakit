export const up = function (knex) {
  return knex.schema.alterTable('pasien', (table) => {
    table.string('NOREKAMMEDIS', 8).unique().notNullable().after('IDPASIEN');
    table.text('ALAMAT_KTP').after('ALAMAT');
  });
};

export const down = function (knex) {
  return knex.schema.alterTable('pasien', (table) => {
    table.dropColumn('NOREKAMMEDIS');
    table.dropColumn('ALAMAT_KTP');
  });
};