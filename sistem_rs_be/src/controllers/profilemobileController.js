import * as ProfileMobileModel from "../models/profilemobileModel.js";
import { uploadToMinio } from "../utils/uploadMinio.js";
import { deleteFromMinio } from "../utils/deleteMinio.js";
import db from "../core/config/knex.js";

// 🔵 GET — Ambil profil rumah sakit
export async function getProfile(req, res) {
  try {
    const data = await ProfileMobileModel.getProfile();
    if (!data) {
      return res
        .status(404)
        .json({ message: "Data profil rumah sakit belum tersedia" });
    }
    res.json({ data });
  } catch (err) {
    console.error("Get Profile Error:", err.message);
    res.status(500).json({ error: err.message });
  }
}

// 🟡 UPDATE — Edit profil rumah sakit
export async function updateProfile(req, res) {
  const trx = await db.transaction();
  try {
    const {
      NAMARS,
      ALAMAT,
      EMAIL,
      NOTELPAMBULAN,
      NOAMBULANWA,
      NOMORHOTLINE,
      DESKRIPSI,
      VISI,
      MISI,
    } = req.body;
    const file = req.file; // ambil file logo dari form multipart/form-data

    // Ambil profil pertama (karena hanya 1)
    const existingProfile = await trx("profile_mobile").first();
    if (!existingProfile) {
      await trx.rollback();
      return res
        .status(404)
        .json({ message: "Profil rumah sakit belum dibuat" });
    }

    let FOTOLOGO = existingProfile.FOTOLOGO;

    // Jika user upload logo baru, hapus yang lama dari MinIO dan upload baru
    if (file) {
      try {
        if (existingProfile.FOTOLOGO) {
          await deleteFromMinio(existingProfile.FOTOLOGO);
        }
      } catch (e) {
        console.warn("⚠️ Gagal hapus logo lama:", e.message);
      }

      // Upload baru ke folder "profile"
      const newPath = await uploadToMinio(file, "profile");
      FOTOLOGO = newPath;
    }

    // Update semua data profil
    await trx("profile_mobile")
      .where({ IDPROFILE: existingProfile.IDPROFILE })
      .update({
        NAMARS,
        ALAMAT: ALAMAT || null,
        EMAIL: EMAIL || null,
        NOTELPAMBULAN: NOTELPAMBULAN || null,
        NOAMBULANWA: NOAMBULANWA || null,
        NOMORHOTLINE: NOMORHOTLINE || null,
        DESKRIPSI: DESKRIPSI || null,
        VISI: VISI || null,
        MISI: MISI || null,
        FOTOLOGO: FOTOLOGO || null,
        UPDATED_AT: db.fn.now(),
      });

    await trx.commit();

    res.json({
      message: "Profil rumah sakit berhasil diperbarui",
      data: {
        NAMARS,
        ALAMAT,
        EMAIL,
        NOTELPAMBULAN,
        NOAMBULANWA,
        NOMORHOTLINE,
        DESKRIPSI,
        VISI,
        MISI,
        FOTOLOGO,
      },
    });
  } catch (err) {
    await trx.rollback();
    console.error("Update Profile Error:", err.message);
    res.status(500).json({ error: err.message });
  }
}
