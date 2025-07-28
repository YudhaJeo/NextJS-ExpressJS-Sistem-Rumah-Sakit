import * as TenagaMedis from '../models/tenagaMedisModel.js';
import bcrypt from 'bcrypt';
import multer from 'multer';

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

export const createTenagaMedis = async (req, res) => {
  try {
    const { body, files } = req;

    const hashedPassword = await bcrypt.hash(body.PASSWORD, 10);

    const data = {
      ...body,
      PASSWORD: hashedPassword,
      FOTOPROFIL: files?.FOTOPROFIL?.[0] ? `/uploads/tenaga_medis/${files.FOTOPROFIL[0].filename}`: null,
      DOKUMENPENDUKUNG: files?.DOKUMENPENDUKUNG?.[0] ? `/uploads/tenaga_medis/${files.DOKUMENPENDUKUNG[0].filename}` : null,
      TANGGALLAHIR: formatDate(body.TANGGALLAHIR),
      TGLEXPSTR: formatDate(body.TGLEXPSTR),
      TGLEXPSIP: formatDate(body.TGLEXPSIP),
      CREATED_AT: toMySQLDateTime(),
      UPDATED_AT: toMySQLDateTime(),
    };

    await TenagaMedis.create(data);

    res.status(201).json({ success: true, message: 'Tenaga medis created' });
  } catch (err) {
    console.error(err);

    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    }
    if (err.message.includes('Hanya file gambar') || err.message.includes('file terlalu besar')) {
      return res.status(400).json({ success: false, message: err.message });
    }

    res.status(500).json({ success: false, message: 'Failed to create tenaga medis' });
  }
};

export const updateTenagaMedis = async (req, res) => {
  try {
    const { body, files } = req;

    const data = {
      ...body,
      FOTOPROFIL: files?.FOTOPROFIL?.[0] ? `/uploads/tenaga_medis/${files.FOTOPROFIL[0].filename}`: null,
      DOKUMENPENDUKUNG: files?.DOKUMENPENDUKUNG?.[0] ? `/uploads/tenaga_medis/${files.DOKUMENPENDUKUNG[0].filename}` : null,
      TANGGALLAHIR: formatDate(body.TANGGALLAHIR),
      TGLEXPSTR: formatDate(body.TGLEXPSTR),
      TGLEXPSIP: formatDate(body.TGLEXPSIP),
      UPDATED_AT: toMySQLDateTime(),
    };

    delete data.PASSWORD;
    delete data.CREATED_AT;

    const result = await TenagaMedis.update(req.params.id, data);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Tenaga medis not found' });
    }

    res.status(200).json({ success: true, message: 'Tenaga medis updated' });
  } catch (err) {
    console.error(err);

    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    }
    if (err.message.includes('Hanya file gambar') || err.message.includes('file terlalu besar')) {
      return res.status(400).json({ success: false, message: err.message });
    }

    res.status(500).json({ success: false, message: 'Failed to update tenaga medis' });
  }
};

export const deleteTenagaMedis = async (req, res) => {
  try {
    const result = await TenagaMedis.remove(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Tenaga medis not found' });
    }
    res.status(200).json({ success: true, message: 'Tenaga medis deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to delete tenaga medis' });
  }
};