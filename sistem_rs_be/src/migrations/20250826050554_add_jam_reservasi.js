export const up = function (knex) {
  return knex.schema.alterTable('reservasi', (table) => {
    table.string('JAMRESERVASI', 20).nullable().after('JADWALPRAKTEK');
  });
};

export const down = function (knex) {
  return knex.schema.alterTable('reservasi', (table) => {
    table.dropColumn('JAMRESERVASI');
  });
};