/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('master_tenaga_medis', (table) => {
    table.increments('IDTENAGAMEDIS').primary();
    table.string('KODETENAGAMEDIS', 20).notNullable().unique();
    table.string('NAMALENGKAP', 100).notNullable();
    table.enu('JENISKELAMIN', ['L', 'P']).notNullable();
    table.string('TEMPATLAHIR', 50).nullable();
    table.date('TANGGALLAHIR').nullable();
    table.string('NOHP', 20).nullable();
    table.string('EMAIL', 100).notNullable().unique();
    table.string('PASSWORD', 255).notNullable();
    table.enu('JENISTENAGAMEDIS', [
      'Dokter Umum',
      'Dokter Spesialis',
      'Dokter Gigi',
      'Dokter Gigi Spesialis',
      'Perawat',
      'Bidan',
      'Apoteker',
      'Asisten Apoteker',
      'Analis Laboratorium',
      'Radiografer',
      'Ahli Gizi',
      'Fisioterapis',
      'Terapis Wicara',
      'Terapis Okupasi',
      'Rekam Medis',
      'Sanitarian',
      'K3 Rumah Sakit',
      'Psikolog Klinis',
      'Manajemen Medis',
      'IT Medis',
      'Penyuluh Kesehatan'
    ]).notNullable();
    table.string('SPESIALISASI', 100).nullable();
    table.string('NOSTR', 50).nullable();
    table.datetime('TGLEXPSTR').nullable(); 
    table.string('NOSIP', 50).nullable();
    table.datetime('TGLEXPSIP').nullable(); 
    table.string('UNITKERJA', 100).nullable();
    table.enu('STATUSKEPEGAWAIAN', ['Tetap', 'Kontrak', 'Honorer']).defaultTo('Tetap');
    table.string('FOTOPROFIL', 255).nullable();
    table.string('DOKUMENPENDUKUNG', 255).nullable();
    table.boolean('STATUSAKTIF').defaultTo(1);
    table.timestamp('CREATED_AT').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('UPDATED_AT').defaultTo(knex.fn.now()).notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTable('master_tenaga_medis');
};