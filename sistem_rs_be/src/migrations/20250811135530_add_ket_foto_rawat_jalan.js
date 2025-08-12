export const up = function (knex) {
  return knex.schema.table('rawat_jalan', (table) => {
    table.text('KETERANGAN').nullable();
    table.string('FOTORESEP', 255).nullable();
  });
};

export const down = function (knex) {
  return knex.schema.table('rawat_jalan', (table) => {
    table.dropColumn('KETERANGAN');
    table.dropColumn('FOTORESEP');
  });
};