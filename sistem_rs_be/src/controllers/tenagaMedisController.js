import * as TenagaMedis from "../models/tenagaMedisModel.js";
import bcrypt from "bcrypt";
import { uploadToMinio } from "../core/utils/uploadMinio.js";
import { deleteFromMinio } from "../core/utils/deleteMinio.js";

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return isNaN(date) ? null : date.toISOString().split('T')[0];
};

const toMySQLDateTime = (date = new Date()) => {
  return date.toISOString().slice(0, 19).replace('T', ' ');
};

export const getAllTenagaMedis = async (req, res) => {
  try {
    const data = await TenagaMedis.getAll();
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch data' });
  }
};

export const getTenagaMedisById = async (req, res) => {
  try {
    const data = await TenagaMedis.getById(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, message: 'Tenaga medis not found' });
    }
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch data' });
  }
};

const generateKodeTenaga = async () => {
  const prefix = 'TM';
  const lastData = await TenagaMedis.getLastKode();
  let nextNumber = 1;
  if (lastData?.KODETENAGAMEDIS) {
    const lastNumber = parseInt(lastData.KODETENAGAMEDIS.replace(prefix, '')) || 0;
    nextNumber = lastNumber + 1;
  }
  return `${prefix}${String(nextNumber).padStart(4, '0')}`;
};

export const createTenagaMedis = async (req, res) => {
  try {
    const { body, files } = req;

    const kodeOtomatis = await generateKodeTenaga();
    const hashedPassword = await bcrypt.hash(body.PASSWORD, 10);

    let fotoProfil = null;
    let dokumenPendukung = null;

    if (files?.FOTOPROFIL?.[0]) {
      fotoProfil = await uploadToMinio(files.FOTOPROFIL[0], "tenaga_medis/foto_profile");
    }
    if (files?.DOKUMENPENDUKUNG?.[0]) {
      dokumenPendukung = await uploadToMinio(files.DOKUMENPENDUKUNG[0], "tenaga_medis/dokumen");
    }

    const data = {
      ...body,
      KODETENAGAMEDIS: kodeOtomatis,
      PASSWORD: hashedPassword,
      FOTOPROFIL: fotoProfil,
      DOKUMENPENDUKUNG: dokumenPendukung,
      TANGGALLAHIR: formatDate(body.TANGGALLAHIR),
      TGLEXPSTR: formatDate(body.TGLEXPSTR),
      TGLEXPSIP: formatDate(body.TGLEXPSIP),
      CREATED_AT: toMySQLDateTime(),
      UPDATED_AT: toMySQLDateTime(),
    };

    await TenagaMedis.create(data);
    res.status(201).json({ success: true, message: "Tenaga medis created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create tenaga medis" });
  }
};

export const updateTenagaMedis = async (req, res) => {
  try {
    const { body, files } = req;

    const existing = await TenagaMedis.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Tenaga medis not found" });
    }

    let fotoProfil = existing.FOTOPROFIL;
    let dokumenPendukung = existing.DOKUMENPENDUKUNG;

    if (files?.FOTOPROFIL?.[0]) {
      await deleteFromMinio(existing.FOTOPROFIL);
      fotoProfil = await uploadToMinio(files.FOTOPROFIL[0], "tenaga_medis/foto_profile");
    }

    if (files?.DOKUMENPENDUKUNG?.[0]) {
      await deleteFromMinio(existing.DOKUMENPENDUKUNG);
      dokumenPendukung = await uploadToMinio(files.DOKUMENPENDUKUNG[0], "tenaga_medis/dokumen");
    }

    const data = {
      ...body,
      FOTOPROFIL: fotoProfil,
      DOKUMENPENDUKUNG: dokumenPendukung,
      TANGGALLAHIR: formatDate(body.TANGGALLAHIR),
      TGLEXPSTR: formatDate(body.TGLEXPSTR),
      TGLEXPSIP: formatDate(body.TGLEXPSIP),
      UPDATED_AT: toMySQLDateTime(),
    };

    delete data.PASSWORD;

    const result = await TenagaMedis.update(req.params.id, data);
    if (!result) {
      return res.status(404).json({ success: false, message: "Tenaga medis not found" });
    }

    res.status(200).json({ success: true, message: "Tenaga medis updated" });
  } catch (err) {
    console.error("❌ Gagal update tenaga medis:", err);
    res.status(500).json({ success: false, message: "Failed to update tenaga medis" });
  }
};

export const deleteTenagaMedis = async (req, res) => {
  try {
    const data = await TenagaMedis.getById(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, message: "Tenaga medis not found" });
    }

    await deleteFromMinio(data.FOTOPROFIL);
    await deleteFromMinio(data.DOKUMENPENDUKUNG);

    const result = await TenagaMedis.remove(req.params.id);

    res.status(200).json({ success: true, message: "Tenaga medis & file berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete tenaga medis" });
  }
};