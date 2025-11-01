// D:\MARSTECH\NextJS-ExpressJS-Final-System\sistem_rs_be\src\migrations\20251027079808_add_password_to_pasien.js

export const up = function (knex) {
  return knex.schema.alterTable('pasien', (table) => {
    table.string('PASSWORD', 255).nullable();
  });
};

export const down = function (knex) {
  return knex.schema.alterTable('pasien', (table) => {
    table.dropColumn('PASSWORD');
  });
};
