/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function (knex) {
  await knex.schema.createTable('role', function (table) {
    table.increments('IDROLE').primary();
    table.string('NAMAROLE', 50).notNullable();
    table.enum('JENISROLE', ['Tenaga Medis', 'Non Medis']).notNullable();
    table.text('KETERANGAN');
  });

  await knex('role').insert([
    {
      IDROLE: 1,
      NAMAROLE: 'Dokter',
      JENISROLE: 'Tenaga Medis',
      KETERANGAN: 'Bertugas melakukan pemeriksaan dan diagnosa pasien'
    },
    {
      IDROLE: 2,
      NAMAROLE: 'Super Admin',
      JENISROLE: 'Non Medis',
      KETERANGAN: 'Memiliki akses penuh ke seluruh sistem'
    },
    {
      IDROLE: 3,
      NAMAROLE: 'Admin Utama',
      JENISROLE: 'Non Medis',
      KETERANGAN: 'Mengelola data pengguna, jadwal, dan manajemen sistem'
    },
    {
      IDROLE: 4,
      NAMAROLE: 'Perawat Poli',
      JENISROLE: 'Tenaga Medis',
      KETERANGAN: 'Membantu dokter dan merawat pasien sesuai prosedur'
    },
    {
      IDROLE: 5,
      NAMAROLE: 'Kasir',
      JENISROLE: 'Non Medis',
      KETERANGAN: 'Mengelola pembayaran dan transaksi keuangan pasien'
    },
    {
      IDROLE: 6,
      NAMAROLE: 'Perawat Rawat Inap',
      JENISROLE: 'Tenaga Medis',
      KETERANGAN: 'Admin untuk rawat inap'
    }
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async function (knex) {
  await knex.schema.dropTable('role');
};
