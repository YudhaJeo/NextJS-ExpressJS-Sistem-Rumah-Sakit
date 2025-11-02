export const up = async function (knex) {
  await knex.schema.createTable("profile_mobile", (table) => {
    table.increments("IDPROFILE").primary();
    table.string("NAMARS", 150).notNullable();
    table.text("ALAMAT");
    table.string("EMAIL", 100);
    table.string("NOTELPAMBULAN", 20);
    table.string("NOAMBULANWA", 20);
    table.string("NOMORHOTLINE", 20);
    table.text("DESKRIPSI");
    table.text("VISI");
    table.text("MISI");
    table.string("FOTOLOGO", 255);
    table.timestamp("CREATED_AT").defaultTo(knex.fn.now());
    table.timestamp("UPDATED_AT").defaultTo(knex.fn.now());
  });

  await knex("profile_mobile").insert({
    NAMARS: "RS Bayza Medika",
    ALAMAT:
      "Jl. Kenangan No. 123, Kecamatan Taman, Kota Madiun",
    EMAIL: "bayzaRS@gmail.com",
    NOTELPAMBULAN: "119",
    NOAMBULANWA: "0814123121",
    NOMORHOTLINE: "082131241231",
    DESKRIPSI:
      "Rumah Sakit Contoh Sehat melayani masyarakat dengan sepenuh hati.",
    VISI: "Menjadi rumah sakit pilihan masyarakat dengan pelayanan terbaik.",
    MISI:
      "1) Memberi layanan kesehatan terbaik.\n2) Mengutamakan keselamatan pasien.\n3) Mengembangkan SDM unggul.",
    FOTOLOGO: "/layout/images/logo.png",
  });
};

export const down = async function (knex) {
  await knex.schema.dropTable("profile_mobile");
};
