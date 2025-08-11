export const up = function (knex) {
  return knex.schema.alterTable('master_tenaga_medis', (table) => {
    table.string('NIP', 50).nullable().after('KODETENAGAMEDIS');
  });
};

export const down = function (knex) {
  return knex.schema.alterTable('master_tenaga_medis', (table) => {
    table.dropColumn('NIP');
  });
};