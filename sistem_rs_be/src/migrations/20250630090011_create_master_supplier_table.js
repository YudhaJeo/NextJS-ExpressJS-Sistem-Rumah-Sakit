/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('master_supplier', (table) => {
    table.increments('SUPPLIERID').primary(); 
    table.string('NAMASUPPLIER', 100).notNullable(); 
    table.string('ALAMAT', 255).notNullable();       
    table.string('KOTA', 50).notNullable();          
    table.string('TELEPON', 20).notNullable();       
    table.string('EMAIL', 100).notNullable();        
    table.string('NAMASALES', 100);                       
    table.timestamp('CREATED_AT').defaultTo(knex.fn.now());
    table.timestamp('UPDATED_AT').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTable('master_supplier');
};
