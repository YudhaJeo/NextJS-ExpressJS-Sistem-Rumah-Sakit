import * as TenagaNonMedis from '../models/tenagaNonMedisModel.js';
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

export const getAllTenagaNonMedis = async (req, res) => {
  try {
    const data = await TenagaNonMedis.getAll();
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch data' });
  }
};

export const getTenagaNonMedisById = async (req, res) => {
  try {
    const data = await TenagaNonMedis.getById(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, message: 'Tenaga non medis not found' });
    }
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch data' });
  }
};

export const createTenagaNonMedis = async (req, res) => {
  try {
    const { body, files } = req;

    const hashedPassword = await bcrypt.hash(body.PASSWORD, 10);

    const data = {
      ...body,
      PASSWORD: hashedPassword,
      FOTOPROFIL: files?.FOTOPROFIL?.[0] ? `/uploads/tenaga_medis/${files.FOTOPROFIL[0].filename}` : null,
      DOKUMENPENDUKUNG: files?.DOKUMENPENDUKUNG?.[0] ? `/uploads/tenaga_medis/${files.DOKUMENPENDUKUNG[0].filename}` : null,
      TANGGALLAHIR: formatDate(body.TANGGALLAHIR),
      CREATED_AT: toMySQLDateTime(),
      UPDATED_AT: toMySQLDateTime(),
    };

    await TenagaNonMedis.create(data);

    res.status(201).json({ success: true, message: 'Tenaga non medis created' });
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

export const updateTenagaNonMedis = async (req, res) => {
  try {
    const { body, files } = req;

    const data = {
      ...body,
      FOTOPROFIL: files?.FOTOPROFIL?.[0] ? `/uploads/tenaga_medis/${files.FOTOPROFIL[0].filename}` : null,
      DOKUMENPENDUKUNG: files?.DOKUMENPENDUKUNG?.[0] ? `/uploads/tenaga_medis/${files.DOKUMENPENDUKUNG[0].filename}` : null,
      TANGGALLAHIR: formatDate(body.TANGGALLAHIR),
      UPDATED_AT: toMySQLDateTime(),
    };

    delete data.PASSWORD;
    delete data.CREATED_AT;

    const result = await TenagaNonMedis.update(req.params.id, data);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Tenaga non medis not found' });
    }

    res.status(200).json({ success: true, message: 'Tenaga non medis updated' });
  } catch (err) {
    console.error(err);

    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    }
    if (err.message.includes('Hanya file gambar') || err.message.includes('file terlalu besar')) {
      return res.status(400).json({ success: false, message: err.message });
    }

    res.status(500).json({ success: false, message: 'Failed to update tenaga non medis' });
  }
};

export const deleteTenagaNonMedis = async (req, res) => {
  try {
    const result = await TenagaNonMedis.remove(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Tenaga non medis not found' });
    }
    res.status(200).json({ success: true, message: 'Tenaga non medis deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to delete tenaga medis' });
  }
};
