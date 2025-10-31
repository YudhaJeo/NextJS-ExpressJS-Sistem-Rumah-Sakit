import * as ReservasiModel from '../models/reservasiModel.js';
import db from '../core/config/knex.js';

export async function getAllReservasi(req, res) {
  try {
    const reservasi = await ReservasiModel.getAll();
    res.json(reservasi);
  } catch (err) {
    console.error('Error backend:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function createReservasi(req, res) {
  const trx = await db.transaction();

  try {
    const { NIK, IDPOLI, IDDOKTER, TANGGALRESERVASI, JAMRESERVASI, STATUS, KETERANGAN } = req.body;

    if (!NIK || !IDPOLI || !IDDOKTER || !TANGGALRESERVASI || !STATUS) {
      await trx.rollback();
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

    await trx('reservasi').insert({
      NIK,
      IDPOLI,
      IDDOKTER,
      TANGGALRESERVASI,
      JAMRESERVASI,
      STATUS,
      KETERANGAN,
    });

    await trx.commit();
    res.json({ message: 'Reservasi dan invoice berhasil ditambahkan' });
  } catch (err) {
    await trx.rollback();
    console.error('❌ Gagal membuat reservasi & invoice:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function updateReservasi(req, res) {
  const trx = await db.transaction();

  try {
    const id = req.params.id;
    const { NIK, IDPOLI, IDDOKTER, TANGGALRESERVASI, JAMRESERVASI, STATUS, KETERANGAN } = req.body;

    // 🔹 Update data reservasi utama
    await trx("reservasi").where("IDRESERVASI", id).update({
      NIK,
      IDPOLI,
      IDDOKTER,
      TANGGALRESERVASI,
      JAMRESERVASI,
      STATUS,
      KETERANGAN,
    });

    // 🔹 Jika status dikonfirmasi → buatkan pendaftaran & rawat jalan
    if (STATUS?.toLowerCase() === "dikonfirmasi") {
      // Cek apakah sudah ada pendaftaran
      let pendaftaran = await trx("pendaftaran")
        .where({ NIK, IDPOLI, TANGGALKUNJUNGAN: TANGGALRESERVASI })
        .first();

      // 🔹 Jika belum ada → buat pendaftaran baru
      if (!pendaftaran) {
        const insertResult = await trx("pendaftaran").insert({
          NIK,
          IDPOLI,
          TANGGALKUNJUNGAN: TANGGALRESERVASI,
          KELUHAN: KETERANGAN,
          STATUSKUNJUNGAN: "Dalam Antrian",
        });

        // MySQL mengembalikan array [insertId]
        const idPendaftaran = insertResult[0];
        pendaftaran = { IDPENDAFTARAN: idPendaftaran };
      }

      // 🔹 Cek apakah sudah ada rawat jalan terkait
      const existingRJ = await trx("rawat_jalan")
        .where("IDPENDAFTARAN", pendaftaran.IDPENDAFTARAN)
        .first();

      // 🔹 Jika belum ada → buat rawat jalan
      if (!existingRJ) {
        await trx("rawat_jalan").insert({
          IDPENDAFTARAN: pendaftaran.IDPENDAFTARAN,
          IDDOKTER,
          STATUSKUNJUNGAN: "Dalam Antrian",
          STATUSRAWAT: "Rawat Jalan",
          DIAGNOSA: "",
          KETERANGAN,
        });
      }

      // 🔹 Cek apakah notifikasi sudah pernah dibuat
      const existingNotif = await trx("notifikasi_user")
        .where({ NIK, JUDUL: "Reservasi dikonfirmasi", TANGGALRESERVASI })
        .first();

      // 🔹 Jika belum ada → buat notifikasi baru
      if (!existingNotif) {
        const detail = await trx("poli")
          .join("dokter", "dokter.IDPOLI", "poli.IDPOLI")
          .join("master_tenaga_medis", "dokter.IDTENAGAMEDIS", "master_tenaga_medis.IDTENAGAMEDIS")
          .select("poli.NAMAPOLI", "master_tenaga_medis.NAMALENGKAP as NAMADOKTER")
          .where("poli.IDPOLI", IDPOLI)
          .andWhere("dokter.IDDOKTER", IDDOKTER)
          .first();

        const namaPoli = detail?.NAMAPOLI || `Poli ${IDPOLI}`;
        const namaDokter = detail?.NAMADOKTER || `Dokter ${IDDOKTER}`;

        await trx("notifikasi_user").insert({
          NIK,
          TANGGALRESERVASI,
          JUDUL: "Reservasi dikonfirmasi",
          PESAN: `Reservasi anda dikonfirmasi. Silakan datang pada tanggal ${TANGGALRESERVASI} di poli ${namaPoli} bersama dokter ${namaDokter}.`,
          IDPOLI,
          IDDOKTER,
          STATUS: false,
        });
      }
    }

    await trx.commit();
    res.json({ message: "Reservasi berhasil diperbarui & masuk ke Rawat Jalan" });
  } catch (err) {
    await trx.rollback();
    console.error("❌ Error updateReservasi:", err);
    res.status(500).json({ error: err.message });
  }
}

export async function deleteReservasi(req, res) {
  try {
    const id = req.params.id;
    await ReservasiModel.remove(id);
    res.json({ message: 'Reservasi berhasil dihapus' });
  } catch (err) {
    console.error('Error backend:', err);
    res.status(500).json({ error: err.message });
  }
}