  export const up = function (knex) {
    return knex.schema.createTable('bed', (table) => {
      table.increments('IDBED').primary();
      table.integer('IDKAMAR').unsigned().notNullable()
        .references('IDKAMAR').inTable('kamar').onDelete('CASCADE');
      table.string('NOMORBED', 10).notNullable();
      table.enu('STATUS', ['TERSEDIA', 'TERISI', 'DIBERSIHKAN'])
        .notNullable().defaultTo('TERSEDIA');
      table.text('KETERANGAN');
      table.timestamp('CREATED_AT').defaultTo(knex.fn.now());
      table.timestamp('UPDATED_AT').defaultTo(knex.fn.now());
    });
  };
  
  export const down = function (knex) {
    return knex.schema.dropTable('bed');
  };