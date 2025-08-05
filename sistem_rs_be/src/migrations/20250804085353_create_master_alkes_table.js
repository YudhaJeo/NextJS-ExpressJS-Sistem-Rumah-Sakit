/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('master_alkes', (table) => {
    table.increments('IDALKES').primary();
    table.string('NAMAALKES').notNullable();
    table.string('JENISALKES').notNullable(); 
    table.integer('STOK').notNullable().defaultTo(0);
    table.double('HARGABELI').notNullable();
    table.double('HARGAJUAL').notNullable();
    table.string('TGLKADALUARSA', 50).notNullable();
    table.integer('SUPPLIERID').unsigned().references('SUPPLIERID').inTable('master_supplier').onDelete('RESTRICT');
    table.timestamp('CREATED_AT').defaultTo(knex.fn.now());
    table.timestamp('UPDATED_AT').defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists('master_alkes');
}