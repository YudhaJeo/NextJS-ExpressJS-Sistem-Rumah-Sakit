import * as InvoiceModel from '../models/invoiceModel.js';
import { generateNoInvoice } from '../utils/generateNoInvoice.js';
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
  const trx = await db.transaction();
  try {
    const { NIK, TANGGALINVOICE, TOTALTAGIHAN, STATUS } = req.body;

    const pasien = await trx('pasien').where('NIK', NIK).first();
    if (!pasien) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Pasien tidak ditemukan' });
    }

    const invoiceDate = TANGGALINVOICE || new Date().toISOString().split('T')[0];
    const NOINVOICE = await generateNoInvoice(invoiceDate, trx); // Pass trx here

    await trx('invoice').insert({
      NOINVOICE,
      NIK,
      IDASURANSI: pasien.IDASURANSI,
      TANGGALINVOICE: invoiceDate,
      TOTALTAGIHAN,
      STATUS: STATUS || 'BELUM_LUNAS'
    });

    await trx.commit();
    res.status(201).json({ success: true, message: 'Invoice berhasil ditambahkan', NOINVOICE });
  } catch (err) {
    await trx.rollback();
    console.error('Create Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateInvoice(req, res) {
  try {
    const { id } = req.params;
    const { NIK, TANGGALINVOICE, TOTALTAGIHAN, STATUS } = req.body; // ⏮️ Hapus NOINVOICE

    const pasien = await db('pasien').where('NIK', NIK).first();
    if (!pasien) {
      return res.status(400).json({ success: false, message: 'Pasien dengan NIK ini tidak ditemukan' });
    }

    const updated = await InvoiceModel.update(id, {
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