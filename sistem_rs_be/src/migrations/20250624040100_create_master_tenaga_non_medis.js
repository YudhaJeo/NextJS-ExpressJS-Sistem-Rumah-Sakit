/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function (knex) {
  // 1️⃣ Buat tabel master_tenaga_non_medis
  await knex.schema.createTable('master_tenaga_non_medis', (table) => {
    table.increments('IDTENAGANONMEDIS').primary();
    table.string('KODETENAGANONMEDIS', 20).notNullable().unique();
    table.string('NAMALENGKAP', 100).notNullable();
    table.enu('JENISKELAMIN', ['L', 'P']).notNullable();
    table.string('TEMPATLAHIR', 50).nullable();
    table.date('TANGGALLAHIR').nullable();
    table.string('NOHP', 20).nullable();
    table.string('EMAIL', 100).notNullable().unique();
    table.string('PASSWORD', 255).notNullable();
    table.string('JENISTENAGANONMEDIS', 50).notNullable();
    table.string('SPESIALISASI', 100).nullable();
    table.string('UNITKERJA', 100).nullable();
    table.enu('STATUSKEPEGAWAIAN', ['Tetap', 'Kontrak', 'Honorer']).defaultTo('Tetap');
    // Kolom NIP ditambahkan langsung di sini (tidak perlu migration terpisah)
    table.string('NIP', 50).nullable();
    table.string('FOTOPROFIL', 255).nullable();
    table.string('DOKUMENPENDUKUNG', 255).nullable();
    table.boolean('STATUSAKTIF').defaultTo(1);
    table.timestamp('CREATED_AT').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('UPDATED_AT').defaultTo(knex.fn.now()).notNullable();
  });

  // 2️⃣ Insert data awal
  await knex('master_tenaga_non_medis').insert([
    {
      IDTENAGANONMEDIS: 5,
      KODETENAGANONMEDIS: 'TNM0001',
      NAMALENGKAP: 'Admin',
      JENISKELAMIN: 'L',
      TEMPATLAHIR: 'Aussie',
      TANGGALLAHIR: '2000-12-30',
      NOHP: '08327467823423',
      EMAIL: 'admin@gmail.com',
      PASSWORD: '$2b$10$kk1sWe0yXauyq/SEUZjWzOsWxDnrAl9DZmh0pAp42zM4lOs4vrSAq',
      JENISTENAGANONMEDIS: 'Admin Utama',
      SPESIALISASI: 'pendaftaran',
      UNITKERJA: 'pendaftaran',
      STATUSKEPEGAWAIAN: 'Tetap',
      NIP: '907986787675767768',
      FOTOPROFIL: '/uploads/tenaga_non_medis/foto_profile/1757495997224-279773818.jpg',
      DOKUMENPENDUKUNG: '/uploads/tenaga_non_medis/dokumen/1757495997236-45249183.pdf',
      STATUSAKTIF: 1,
      CREATED_AT: '2025-08-30 16:45:14',
      UPDATED_AT: '2025-09-09 19:19:57',
    },
    {
      IDTENAGANONMEDIS: 6,
      KODETENAGANONMEDIS: 'TNM0002',
      NAMALENGKAP: 'Kasir',
      JENISKELAMIN: 'P',
      TEMPATLAHIR: 'Bern',
      TANGGALLAHIR: '2002-01-31',
      NOHP: '0173901273987',
      EMAIL: 'kasir@gmail.com',
      PASSWORD: '$2b$10$1Az3V8gQrThqr55xIdWgjeIiF1.muQQhh8nQ0eGlFUJpB2WNVq3Su',
      JENISTENAGANONMEDIS: 'Kasir',
      SPESIALISASI: 'kasir',
      UNITKERJA: 'kasir',
      STATUSKEPEGAWAIAN: 'Kontrak',
      NIP: null,
      FOTOPROFIL: '/uploads/tenaga_non_medis/foto_profile/1757496048596-172759654.jpg',
      DOKUMENPENDUKUNG: '/uploads/tenaga_non_medis/dokumen/1757496048607-268516718.pdf',
      STATUSAKTIF: 1,
      CREATED_AT: '2025-08-30 16:50:45',
      UPDATED_AT: '2025-09-09 19:20:48',
    },
    {
      IDTENAGANONMEDIS: 7,
      KODETENAGANONMEDIS: 'TNM0003',
      NAMALENGKAP: 'Super Admin',
      JENISKELAMIN: 'L',
      TEMPATLAHIR: 'Amman',
      TANGGALLAHIR: '2003-03-01',
      NOHP: '089217398173',
      EMAIL: 'superadmin@gmail.com',
      PASSWORD: '$2b$10$LpeAGZ2GydsHHry3eVZ80.03RizFkZqmcYB2.RJckxcppwKf08ugy',
      JENISTENAGANONMEDIS: 'Super Admin',
      SPESIALISASI: 'super admin',
      UNITKERJA: 'super admin',
      STATUSKEPEGAWAIAN: 'Tetap',
      NIP: '123871234814124132',
      FOTOPROFIL: '/uploads/tenaga_non_medis/foto_profile/1757496061738-392810476.jpg',
      DOKUMENPENDUKUNG: '/uploads/tenaga_non_medis/dokumen/1757496061746-944207212.pdf',
      STATUSAKTIF: 1,
      CREATED_AT: '2025-08-30 16:55:15',
      UPDATED_AT: '2025-09-09 19:21:01',
    },
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async function (knex) {
  await knex.schema.dropTable('master_tenaga_non_medis');
};
