import * as DepositModel from '../models/depositModel.js';
import { generateNoDeposit } from '../utils/generateNoDeposit.js';
import db from '../core/config/knex.js';

export async function getAllDeposit(req, res) {
  try {
    const data = await DepositModel.getAll();
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Get All Deposit Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getDepositById(req, res) {
  try {
    const { id } = req.params;
    const deposit = await DepositModel.getById(id);

    if (!deposit) {
      return res.status(404).json({ success: false, message: 'Deposit tidak ditemukan' });
    }

    res.status(200).json({ success: true, data: deposit });
  } catch (err) {
    console.error('Get Deposit By ID Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function createDeposit(req, res) {
  const trx = await db.transaction();
  try {
    const { IDINVOICE, TANGGALDEPOSIT, NOMINAL, METODE, STATUS, KETERANGAN, IDBANK } = req.body;

    const invoice = await trx('invoice').where('IDINVOICE', IDINVOICE).first();
    if (!invoice) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Invoice tidak ditemukan' });
    }

    const pasien = await trx('pasien').where('NIK', invoice.NIK).first();
    if (!pasien) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Pasien tidak ditemukan dari invoice' });
    }

    if (METODE === 'Transfer Bank' && !IDBANK) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Bank wajib dipilih untuk Transfer Bank' });
    }

    const tanggalDeposit = TANGGALDEPOSIT || new Date().toISOString().split('T')[0];
    const NODEPOSIT = await generateNoDeposit(tanggalDeposit, trx);

    const saldoSisa = NOMINAL || 0;
    const statusFinal = saldoSisa === 0 ? 'HABIS' : STATUS;

    await trx('deposit').insert({
      NODEPOSIT,
      IDINVOICE,
      TANGGALDEPOSIT: tanggalDeposit,
      NOMINAL,
      METODE,
      IDBANK: METODE === 'Transfer Bank' ? IDBANK : null,
      SALDO_SISA: saldoSisa,
      STATUS: statusFinal,
      KETERANGAN,
    });

    // ✅ Hitung ulang TOTALDEPOSIT
    const totalDeposit = await trx('deposit')
      .where('IDINVOICE', IDINVOICE)
      .sum('NOMINAL as total')
      .first();

    const newTotalDeposit = totalDeposit.total || 0;

    // ✅ Hitung ulang SISA_TAGIHAN
    const sisaTagihan = invoice.TOTALTAGIHAN + newTotalDeposit - invoice.TOTALANGSURAN;
    const newStatus = sisaTagihan <= 0 ? 'LUNAS' : 'BELUM_LUNAS';

    await trx('invoice')
      .where('IDINVOICE', IDINVOICE)
      .update({
        TOTALDEPOSIT: newTotalDeposit,
        SISA_TAGIHAN: sisaTagihan,
        STATUS: newStatus,
        UPDATED_AT: trx.fn.now(),
      });

    await trx.commit();
    res.status(201).json({ success: true, message: 'Deposit berhasil ditambahkan', NODEPOSIT });
  } catch (err) {
    await trx.rollback();
    console.error('Create Deposit Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateDeposit(req, res) {
  const trx = await db.transaction();
  try {
    const { id } = req.params;
    const { IDINVOICE, TANGGALDEPOSIT, NOMINAL, METODE, SALDO_SISA, STATUS, KETERANGAN, IDBANK } = req.body;

    const invoice = await trx('invoice').where('IDINVOICE', IDINVOICE).first();
    if (!invoice) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Invoice tidak ditemukan' });
    }

    if (METODE === 'Transfer Bank' && !IDBANK) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Bank wajib dipilih untuk Transfer Bank' });
    }

    const idBankFinal = METODE === 'Transfer Bank' ? IDBANK : null;
    const statusFinal = (SALDO_SISA === 0) ? 'HABIS' : STATUS;

    const updated = await trx('deposit')
      .where('IDDEPOSIT', id)
      .update({
        IDINVOICE,
        TANGGALDEPOSIT: TANGGALDEPOSIT || trx.fn.now(),
        NOMINAL,
        METODE,
        IDBANK: idBankFinal,
        SALDO_SISA,
        STATUS: statusFinal,
        KETERANGAN,
        UPDATED_AT: trx.fn.now(),
      });

    if (!updated) {
      await trx.rollback();
      return res.status(404).json({ success: false, message: 'Deposit tidak ditemukan' });
    }

    // ✅ Hitung ulang TOTALDEPOSIT
    const totalDeposit = await trx('deposit')
      .where('IDINVOICE', IDINVOICE)
      .sum('NOMINAL as total')
      .first();

    const newTotalDeposit = totalDeposit.total || 0;

    // ✅ Hitung ulang SISA_TAGIHAN
    const sisaTagihan = invoice.TOTALTAGIHAN + newTotalDeposit - invoice.TOTALANGSURAN;
    const newStatus = sisaTagihan <= 0 ? 'LUNAS' : 'BELUM_LUNAS';

    await trx('invoice')
      .where('IDINVOICE', IDINVOICE)
      .update({
        TOTALDEPOSIT: newTotalDeposit,
        SISA_TAGIHAN: sisaTagihan,
        STATUS: newStatus,
        UPDATED_AT: trx.fn.now(),
      });

    await trx.commit();
    res.status(200).json({ success: true, message: 'Deposit berhasil diperbarui' });
  } catch (err) {
    await trx.rollback();
    console.error('Update Deposit Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteDeposit(req, res) {
  const trx = await db.transaction();
  try {
    const { id } = req.params;

    // Ambil IDINVOICE dari deposit sebelum dihapus
    const deposit = await trx('deposit').where('IDDEPOSIT', id).first();
    if (!deposit) {
      await trx.rollback();
      return res.status(404).json({ success: false, message: 'Deposit tidak ditemukan' });
    }

    const { IDINVOICE } = deposit;
    const invoice = await trx('invoice').where('IDINVOICE', IDINVOICE).first();
    if (!invoice) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Invoice tidak ditemukan' });
    }

    // Hapus deposit
    await trx('deposit').where('IDDEPOSIT', id).del();

    // Hitung ulang TOTALDEPOSIT setelah penghapusan
    const totalDeposit = await trx('deposit')
      .where('IDINVOICE', IDINVOICE)
      .sum('NOMINAL as total')
      .first();

    const newTotalDeposit = totalDeposit.total || 0;

    // Hitung ulang SISA_TAGIHAN
    const sisaTagihan = invoice.TOTALTAGIHAN + newTotalDeposit - invoice.TOTALANGSURAN;
    const newStatus = sisaTagihan <= 0 ? 'LUNAS' : 'BELUM_LUNAS';

    // Update invoice
    await trx('invoice')
      .where('IDINVOICE', IDINVOICE)
      .update({
        TOTALDEPOSIT: newTotalDeposit,
        SISA_TAGIHAN: sisaTagihan,
        STATUS: newStatus,
        UPDATED_AT: trx.fn.now(),
      });

    await trx.commit();
    res.status(200).json({ success: true, message: 'Deposit berhasil dihapus' });
  } catch (err) {
    await trx.rollback();
    console.error('Delete Deposit Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getDepositOptions(req, res) {
  try {
    const rows = await db('deposit')
    .join('invoice', 'deposit.IDINVOICE', 'invoice.IDINVOICE')
    .join('pasien', 'invoice.NIK', 'pasien.NIK')
    .where('deposit.STATUS', 'AKTIF')
    .select(
      'deposit.IDDEPOSIT as value',
      'deposit.NODEPOSIT as label',
      'deposit.SALDO_SISA',
      'pasien.NIK',
      'pasien.NAMALENGKAP as NAMAPASIEN'
    );
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error('Error getDepositOptions:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}