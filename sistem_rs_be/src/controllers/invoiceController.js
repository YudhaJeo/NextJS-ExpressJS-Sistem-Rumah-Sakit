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

export async function updateInvoice(req, res) {
  try {
    const { id } = req.params;
    const { NIK, TANGGALINVOICE, STATUS } = req.body;

    const pasien = await db('pasien').where('NIK', NIK).first();
    if (!pasien) {
      return res.status(400).json({ success: false, message: 'Pasien tidak ditemukan' });
    }

    const updated = await InvoiceModel.update(id, {
      NIK,
      IDASURANSI: pasien.IDASURANSI,
      TANGGALINVOICE: TANGGALINVOICE || db.fn.now(),
      STATUS,
      UPDATED_AT: db.fn.now(),
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
  const trx = await db.transaction();
  try {
    const { id } = req.params;

    const penggunaanAda = await trx('deposit_penggunaan')
      .where('IDINVOICE', id)
      .first();

    if (penggunaanAda) {
      await trx.rollback();
      return res.status(400).json({
        success: false,
        message: 'Tidak dapat menghapus invoice yang memiliki penggunaan deposit',
      });
    }

    const deleted = await InvoiceModel.remove(id, trx);

    if (!deleted) {
      await trx.rollback();
      return res.status(404).json({ success: false, message: 'Invoice tidak ditemukan' });
    }

    await trx.commit();
    res.status(200).json({ success: true, message: 'Invoice berhasil dihapus' });
  } catch (err) {
    await trx.rollback();
    console.error('Delete Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getInvoiceOptions(req, res) {
  try {
    const rows = await db('invoice')
      .leftJoin('pasien', 'invoice.NIK', 'pasien.NIK')
      .where('invoice.STATUS', 'BELUM_LUNAS')
      .select(
        'invoice.IDINVOICE as value',
        db.raw('CONCAT("INV-", invoice.IDINVOICE) as label'),
        'pasien.NIK',
        'pasien.NAMALENGKAP as NAMAPASIEN'
      );

    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error('Error getInvoiceOptions:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}