import * as ReservasiModel from '../models/reservasiModel.js';
import db from '../core/config/knex.js';
import { generateNoInvoice } from '../utils/generateNoInvoice.js';

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

    const pasien = await trx('pasien').where('NIK', NIK).first();
    if (!pasien) {
      await trx.rollback();
      return res.status(400).json({ error: 'Pasien tidak ditemukan' });
    }

    const tanggalInvoice = new Date().toISOString().split('T')[0];
    const NOINVOICE = await generateNoInvoice(tanggalInvoice, trx);

    await trx('invoice').insert({
      NOINVOICE,
      NIK,
      IDASURANSI: pasien.IDASURANSI || null,
      TANGGALINVOICE: tanggalInvoice,
      TOTALTAGIHAN: 0,
      STATUS: 'BELUM_LUNAS',
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

    await trx("reservasi").where("IDRESERVASI", id).update({
      NIK,
      IDPOLI,
      IDDOKTER,
      TANGGALRESERVASI,
      JAMRESERVASI,
      STATUS,
      KETERANGAN,
    });

    if (STATUS === "Dikonfirmasi") {
      let pendaftaran = await trx("pendaftaran")
        .where({ NIK, IDPOLI, TANGGALKUNJUNGAN: TANGGALRESERVASI })
        .first();

      if (!pendaftaran) {
        const [idPendaftaran] = await trx("pendaftaran").insert(
          {
            NIK,
            IDPOLI,
            TANGGALKUNJUNGAN: TANGGALRESERVASI,
            KELUHAN: KETERANGAN,
            STATUSKUNJUNGAN: "Dalam Antrian",
          },
          ["IDPENDAFTARAN"]
        );
        pendaftaran = { IDPENDAFTARAN: idPendaftaran };
      }

      const existingRJ = await trx("rawat_jalan")
        .where("IDPENDAFTARAN", pendaftaran.IDPENDAFTARAN)
        .first();

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