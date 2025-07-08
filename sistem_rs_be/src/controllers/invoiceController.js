import * as InvoiceModel from '../models/invoiceModel.js';
import db from '../core/config/knex.js';

export async function getAllInvoice(req, res) {
  try {
    const data = await InvoiceModel.getAll();
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Get All Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getInvoiceById(req, res) {
  try {
    const { id } = req.params;
    const invoice = await InvoiceModel.getById(id);

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice tidak ditemukan' });
    }

    res.status(200).json({ success: true, data: invoice });
  } catch (err) {
    console.error('Get By ID Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function createInvoice(req, res) {
  try {
    const { NOINVOICE, NIK, TANGGALINVOICE, TOTALTAGIHAN, STATUS } = req.body;

    if (!NOINVOICE || !NIK || !TOTALTAGIHAN) {
      return res.status(400).json({ success: false, message: 'NOINVOICE, NIK, dan TOTALTAGIHAN wajib diisi' });
    }

    const pasien = await db('pasien').where('NIK', NIK).first();
    if (!pasien) {
      return res.status(400).json({ success: false, message: 'Pasien dengan NIK ini tidak ditemukan' });
    }

    await InvoiceModel.create({
      NOINVOICE,
      NIK,
      IDASURANSI: pasien.IDASURANSI,
      TANGGALINVOICE: TANGGALINVOICE || db.fn.now(),
      TOTALTAGIHAN,
      STATUS: STATUS || 'Belum Dibayar'
    });

    res.status(201).json({ success: true, message: 'Invoice berhasil ditambahkan' });
  } catch (err) {
    console.error('Create Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateInvoice(req, res) {
  try {
    const { id } = req.params;
    const { NOINVOICE, NIK, TANGGALINVOICE, TOTALTAGIHAN, STATUS } = req.body;

    const pasien = await db('pasien').where('NIK', NIK).first();
    if (!pasien) {
      return res.status(400).json({ success: false, message: 'Pasien dengan NIK ini tidak ditemukan' });
    }

    const updated = await InvoiceModel.update(id, {
      NOINVOICE,
      NIK,
      IDASURANSI: pasien.IDASURANSI,
      TANGGALINVOICE: TANGGALINVOICE || db.fn.now(),
      TOTALTAGIHAN,
      STATUS
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Invoice tidak ditemukan' });
    }

    res.status(200).json({ success: true, message: 'Invoice berhasil diperbarui' });
  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteInvoice(req, res) {
  try {
    const { id } = req.params;
    const deleted = await InvoiceModel.remove(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Invoice tidak ditemukan' });
    }

    res.status(200).json({ success: true, message: 'Invoice berhasil dihapus' });
  } catch (err) {
    console.error('Delete Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}