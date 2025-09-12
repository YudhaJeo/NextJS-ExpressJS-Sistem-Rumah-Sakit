import * as AngsuranModel from '../models/angsuranModel.js';
import db from '../core/config/knex.js';
import { generateNoAngsuran } from '../utils/generateNoAngsuran.js';

export async function getAllAngsuran(req, res) {
  try {
    const data = await AngsuranModel.getAll();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getAngsuranById(req, res) {
  try {
    const { id } = req.params;
    const data = await AngsuranModel.getById(id);
    if (!data) return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getAngsuranByInvoice(req, res) {
  try {
    const { idInvoice } = req.params;
    const data = await AngsuranModel.getByInvoice(idInvoice);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function createAngsuran(req, res) {
  const trx = await db.transaction();
  try {
    const { IDINVOICE, NOMINAL, METODE, IDBANK, KETERANGAN } = req.body;

    const invoice = await trx('invoice').where('IDINVOICE', IDINVOICE).first();
    if (!invoice) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Invoice tidak ditemukan' });
    }

    if (NOMINAL > invoice.SISA_TAGIHAN) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Nominal melebihi sisa tagihan' });
    }

    if (METODE === 'Transfer Bank' && !IDBANK) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Bank wajib dipilih untuk Transfer Bank' });
    }

    const tanggalBayar = new Date().toISOString();
    const NOANGSURAN = await generateNoAngsuran(tanggalBayar, trx);

    await AngsuranModel.create({
      NOANGSURAN,
      IDINVOICE,
      NOMINAL,
      METODE,
      IDBANK: METODE === 'Transfer Bank' ? IDBANK : null,
      KETERANGAN
    }, trx);

    const totalSetelahBayar = (invoice.TOTALANGSURAN || 0) + NOMINAL;
    const sisaTagihanBaru = invoice.SISA_TAGIHAN - NOMINAL;

    await trx('invoice')
      .where('IDINVOICE', IDINVOICE)
      .update({
        TOTALANGSURAN: totalSetelahBayar,
        SISA_TAGIHAN: sisaTagihanBaru,
        STATUS: sisaTagihanBaru <= 0 ? 'LUNAS' : 'BELUM_LUNAS',
        UPDATED_AT: db.fn.now()
      });

    await trx.commit();
    res.status(201).json({ success: true, message: 'Angsuran berhasil ditambahkan' });
  } catch (err) {
    await trx.rollback();
    console.error('Create Angsuran Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateAngsuran(req, res) {
  const trx = await db.transaction();
  try {
    const { id } = req.params;
    const { IDINVOICE, NOMINAL, METODE, IDBANK, KETERANGAN } = req.body;

    const angsuranLama = await trx('angsuran').where('IDANGSURAN', id).first();
    if (!angsuranLama) {
      await trx.rollback();
      return res.status(404).json({ success: false, message: 'Angsuran tidak ditemukan' });
    }

    const invoice = await trx('invoice').where('IDINVOICE', IDINVOICE).first();
    if (!invoice) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Invoice tidak ditemukan' });
    }

    // rollback dulu angsuran lama
    const totalAngsuranSebelum = (invoice.TOTALANGSURAN || 0) - angsuranLama.NOMINAL;
    const sisaTagihanSebelum = (invoice.SISA_TAGIHAN || 0) + angsuranLama.NOMINAL;

    if (NOMINAL > sisaTagihanSebelum) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Nominal melebihi sisa tagihan' });
    }

    await trx('angsuran').where('IDANGSURAN', id).update({
      NOMINAL,
      METODE,
      IDBANK: METODE === 'Transfer Bank' ? IDBANK : null,
      KETERANGAN,
      UPDATED_AT: trx.fn.now()
    });

    const totalSetelahUpdate = totalAngsuranSebelum + NOMINAL;
    const sisaTagihanBaru = sisaTagihanSebelum - NOMINAL;

    await trx('invoice')
      .where('IDINVOICE', IDINVOICE)
      .update({
        TOTALANGSURAN: totalSetelahUpdate,
        SISA_TAGIHAN: sisaTagihanBaru,
        STATUS: sisaTagihanBaru <= 0 ? 'LUNAS' : 'BELUM_LUNAS',
        UPDATED_AT: trx.fn.now()
      });

    await trx.commit();
    res.json({ success: true, message: 'Angsuran berhasil diperbarui' });
  } catch (err) {
    await trx.rollback();
    console.error('Update Angsuran Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteAngsuran(req, res) {
  const trx = await db.transaction();
  try {
    const { id } = req.params;

    const angsuran = await trx('angsuran').where('IDANGSURAN', id).first();
    if (!angsuran) {
      await trx.rollback();
      return res.status(404).json({ success: false, message: 'Angsuran tidak ditemukan' });
    }

    const { IDINVOICE } = angsuran;
    const invoice = await trx('invoice').where('IDINVOICE', IDINVOICE).first();
    if (!invoice) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Invoice tidak ditemukan' });
    }

    await trx('angsuran').where('IDANGSURAN', id).del();

    const totalSetelahHapus = (invoice.TOTALANGSURAN || 0) - angsuran.NOMINAL;
    const sisaTagihanBaru = (invoice.SISA_TAGIHAN || 0) + angsuran.NOMINAL;

    await trx('invoice')
      .where('IDINVOICE', IDINVOICE)
      .update({
        TOTALANGSURAN: totalSetelahHapus,
        SISA_TAGIHAN: sisaTagihanBaru,
        STATUS: sisaTagihanBaru <= 0 ? 'LUNAS' : 'BELUM_LUNAS',
        UPDATED_AT: trx.fn.now()
      });

    await trx.commit();
    res.json({ success: true, message: 'Angsuran berhasil dihapus' });
  } catch (err) {
    await trx.rollback();
    console.error('Delete Angsuran Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}