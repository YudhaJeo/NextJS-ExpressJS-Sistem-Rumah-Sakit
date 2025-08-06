/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("fefo", (table) => {
    table.increments("IDBATCH").primary();
    table.enum("TIPE", ["OBAT", "ALKES"]).notNullable();
    table.integer("ITEMID").unsigned().notNullable(); 
    table.string("TGLKADALUARSA").notNullable();
    table.integer("STOK").defaultTo(0);
    table.double("HARGABELI", 15, 2).notNullable();
    table.double("HARGAJUAL", 15, 2).notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTableIfExists("fefo");
};
