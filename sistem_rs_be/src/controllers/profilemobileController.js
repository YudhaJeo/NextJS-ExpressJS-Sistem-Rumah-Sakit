import * as ProfileMobileModel from "../models/profilemobileModel.js";
import { uploadToMinio } from "../utils/uploadMinio.js";
import { deleteFromMinio } from "../utils/deleteMinio.js";

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

export async function updateProfile(req, res) {
  try {
    const { id } = req.params;
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
    const file = req.file; 

    const existingProfile = await ProfileMobileModel.getById(id);
    if (!existingProfile) {
      return res
        .status(404)
        .json({ message: "Profil rumah sakit belum dibuat" });
    }

    let FOTOLOGO = existingProfile.FOTOLOGO;

    if (file) {
      try {
        await deleteFromMinio(existingProfile.FOTOLOGO);
      } catch (e) {
        console.warn("⚠️ Gagal hapus logo lama:", e.message);
      }

      const newPath = await uploadToMinio(file, "profile");
      FOTOLOGO = newPath;
    }

    const updatedData = {
      NAMARS: NAMARS || existingProfile.NAMARS,
      ALAMAT: ALAMAT || existingProfile.ALAMAT,
      EMAIL: EMAIL || existingProfile.EMAIL,
      NOTELPAMBULAN: NOTELPAMBULAN || existingProfile.NOTELPAMBULAN,
      NOAMBULANWA: NOAMBULANWA || existingProfile.NOAMBULANWA,
      NOMORHOTLINE: NOMORHOTLINE || existingProfile.NOMORHOTLINE,
      DESKRIPSI: DESKRIPSI || existingProfile.DESKRIPSI,
      VISI: VISI || existingProfile.VISI,
      MISI: MISI || existingProfile.MISI,
      FOTOLOGO: FOTOLOGO || existingProfile.FOTOLOGO,
      UPDATED_AT: new Date(),
    }
    
    await ProfileMobileModel.updateProfile(id, updatedData);
    res.json({ message: "Profil rumah sakit berhasil diperbarui", data: updatedData });
  } catch (err) {
    console.error("Update Profile Error:", err.message);
    res.status(500).json({ error: err.message });
  }
}
