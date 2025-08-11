export const up = function (knex) {
  return knex.schema.alterTable('master_tenaga_non_medis', (table) => {
    table.string('NIP', 50).nullable().after('STATUSKEPEGAWAIAN');
  });
};

export const down = function (knex) {
  return knex.schema.alterTable('master_tenaga_non_medis', (table) => {
    table.dropColumn('NIP');
  });
};