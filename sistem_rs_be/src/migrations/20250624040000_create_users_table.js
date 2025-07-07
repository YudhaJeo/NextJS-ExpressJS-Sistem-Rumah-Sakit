/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
    return knex.schema.createTable('users', (table) => {
      table.increments('ID').primary();
      table.string('USERNAME', 50).notNullable();
      table.string('PASSWORD', 255).notNullable();
      table.string('EMAIL', 100).defaultTo(null);
      table.enu('ROLE', ['superadmin', 'admin', 'dokter', 'kasir', 'apoteker']).notNullable();
      table.timestamp('CREATED_AT').defaultTo(knex.fn.now());
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  export const down = function (knex) {
    return knex.schema.dropTable('users');
  };
  