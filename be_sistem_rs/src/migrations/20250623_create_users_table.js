export async function up(knex) {
    await knex.schema.createTable('users', (table) => {
      table.increments('ID').primary();
      table.string('USERNAME', 50).notNullable().unique();
      table.string('PASSWORD', 255).notNullable();
      table.string('EMAIL', 100);
      table.enu('ROLE', ['superadmin', 'admin', 'dokter', 'kasir', 'apoteker']).notNullable();
      table.timestamp('CREATED_AT').defaultTo(knex.fn.now());
    });
  }
  
  export async function down(knex) {
    await knex.schema.dropTableIfExists('users');
  }
  