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

    const deposits = await trx('deposit')
      .where('IDINVOICE', IDINVOICE)
      .andWhere('STATUS', 'AKTIF');

    let sisaBayar = NOMINAL;
    let totalPakaiDeposit = 0;
    const usedDepositIds = [];

    for (const dep of deposits) {
      if (sisaBayar <= 0) break;

      const pakai = Math.min(dep.SALDO_SISA, sisaBayar);
      sisaBayar -= pakai;
      totalPakaiDeposit += pakai;

      if (pakai > 0) {
        await trx('deposit')
          .where('IDDEPOSIT', dep.IDDEPOSIT)
          .update({
            SALDO_SISA: dep.SALDO_SISA - pakai,
            STATUS: dep.SALDO_SISA - pakai <= 0 ? 'HABIS' : 'AKTIF',
            UPDATED_AT: trx.fn.now()
          });

        await trx('deposit_penggunaan').insert({
          IDDEPOSIT: dep.IDDEPOSIT,
          IDINVOICE,
          JUMLAH_PEMAKAIAN: pakai,
          TANGGALPEMAKAIAN: trx.fn.now(),
          CREATED_AT: trx.fn.now(),
          UPDATED_AT: trx.fn.now()
        });

        usedDepositIds.push(dep.IDDEPOSIT);
      }
    }

    const totalDeposit = await trx('deposit')
      .where('IDINVOICE', IDINVOICE)
      .andWhere('STATUS', 'AKTIF')
      .sum('SALDO_SISA as total')
      .first();

    await trx('invoice')
      .where('IDINVOICE', IDINVOICE)
      .update({ TOTALDEPOSIT: totalDeposit.total || 0 });

    const tanggalBayar = new Date().toISOString();
    const NOANGSURAN = await generateNoAngsuran(tanggalBayar, trx);

    let metodeBayar = totalPakaiDeposit >= NOMINAL ? 'Deposit' : METODE;
    let nominalBayar = NOMINAL;

    if (metodeBayar === 'Transfer Bank' && !IDBANK) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Bank wajib dipilih untuk Transfer Bank' });
    }

    await AngsuranModel.create({
      NOANGSURAN,
      IDINVOICE,
      NOMINAL: nominalBayar,
      METODE: metodeBayar,
      IDBANK: metodeBayar === 'Transfer Bank' ? IDBANK : null,
      KETERANGAN:
        totalPakaiDeposit > 0 && totalPakaiDeposit < NOMINAL
          ? `Kombinasi pembayaran: Deposit Rp ${totalPakaiDeposit.toLocaleString('id-ID')} + ${metodeBayar} Rp ${(NOMINAL - totalPakaiDeposit).toLocaleString('id-ID')}`
          : (metodeBayar === 'Deposit'
              ? 'Pembayaran penuh menggunakan deposit'
              : KETERANGAN)
    }, trx);
    
    const sisaTagihanBaru = invoice.SISA_TAGIHAN - NOMINAL;
    const totalSetelahBayar = (invoice.TOTALANGSURAN || 0) + NOMINAL;

    await trx('invoice')
      .where('IDINVOICE', IDINVOICE)
      .update({
        TOTALANGSURAN: totalSetelahBayar,
        SISA_TAGIHAN: sisaTagihanBaru,
        STATUS: sisaTagihanBaru <= 0 ? 'LUNAS' : 'BELUM_LUNAS',
        UPDATED_AT: trx.fn.now()
      });

    if (sisaTagihanBaru <= 0 && usedDepositIds.length > 0) {
      await trx('deposit')
        .whereIn('IDDEPOSIT', usedDepositIds)
        .update({
          STATUS: 'REFUND',
          KETERANGAN: 'Deposit direfund karena invoice sudah lunas',
          UPDATED_AT: trx.fn.now()
        });

      const totalDepositFinal = await trx('deposit')
        .where('IDINVOICE', IDINVOICE)
        .andWhere('STATUS', 'AKTIF')
        .sum('SALDO_SISA as total')
        .first();

      await trx('invoice')
        .where('IDINVOICE', IDINVOICE)
        .update({
          TOTALDEPOSIT: totalDepositFinal.total || 0,
          UPDATED_AT: trx.fn.now()
        });
    }

    await trx.commit();
    res.status(201).json({
      success: true,
      message:
        totalPakaiDeposit === NOMINAL
          ? 'Pembayaran berhasil menggunakan deposit penuh, invoice lunas.'
          : totalPakaiDeposit > 0
          ? 'Pembayaran berhasil menggunakan kombinasi deposit + metode lain.'
          : 'Pembayaran angsuran berhasil.'
    });

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
    const { NOMINAL, METODE, IDBANK, KETERANGAN } = req.body;

    const angsuran = await trx('angsuran').where('IDANGSURAN', id).first();
    if (!angsuran) {
      await trx.rollback();
      return res.status(404).json({ success: false, message: 'Angsuran tidak ditemukan' });
    }

    const invoice = await trx('invoice').where('IDINVOICE', angsuran.IDINVOICE).first();
    if (!invoice) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Invoice tidak ditemukan' });
    }

    const penggunaanLama = await trx('deposit_penggunaan').where('IDINVOICE', angsuran.IDINVOICE);
    for (const p of penggunaanLama) {
      await trx('deposit')
        .where('IDDEPOSIT', p.IDDEPOSIT)
        .increment('SALDO_SISA', p.JUMLAH_PEMAKAIAN)
        .update({ STATUS: 'AKTIF', UPDATED_AT: trx.fn.now() });
    }
    await trx('deposit_penggunaan').where('IDINVOICE', angsuran.IDINVOICE).del();

    let sisaBayar = NOMINAL;
    const usedDepositIds = [];
    const deposits = await trx('deposit')
      .where('IDINVOICE', angsuran.IDINVOICE)
      .andWhere('STATUS', 'AKTIF');

    for (const dep of deposits) {
      if (sisaBayar <= 0) break;

      const pakai = Math.min(dep.SALDO_SISA, sisaBayar);
      sisaBayar -= pakai;

      if (pakai > 0) {
        await trx('deposit')
          .where('IDDEPOSIT', dep.IDDEPOSIT)
          .update({
            SALDO_SISA: dep.SALDO_SISA - pakai,
            STATUS: dep.SALDO_SISA - pakai <= 0 ? 'HABIS' : 'AKTIF',
            UPDATED_AT: trx.fn.now()
          });

        await trx('deposit_penggunaan').insert({
          IDDEPOSIT: dep.IDDEPOSIT,
          IDINVOICE: angsuran.IDINVOICE,
          JUMLAH_PEMAKAIAN: pakai,
          TANGGALPEMAKAIAN: trx.fn.now(),
          CREATED_AT: trx.fn.now(),
          UPDATED_AT: trx.fn.now()
        });

        usedDepositIds.push(dep.IDDEPOSIT);
      }
    }

    await trx('angsuran')
      .where('IDANGSURAN', id)
      .update({
        NOMINAL,
        METODE,
        IDBANK: METODE === 'Transfer Bank' ? IDBANK : null,
        KETERANGAN,
        UPDATED_AT: trx.fn.now()
      });

    const sisaTagihanBaru = invoice.SISA_TAGIHAN - NOMINAL;
    await trx('invoice')
      .where('IDINVOICE', angsuran.IDINVOICE)
      .update({
        SISA_TAGIHAN: sisaTagihanBaru,
        STATUS: sisaTagihanBaru <= 0 ? 'LUNAS' : 'BELUM_LUNAS',
        UPDATED_AT: trx.fn.now()
      });

    if (sisaTagihanBaru <= 0 && usedDepositIds.length > 0) {
      await trx('deposit')
        .whereIn('IDDEPOSIT', usedDepositIds)
        .update({ 
          STATUS: 'REFUND', 
          KETERANGAN: 'Deposit direfund karena invoice sudah lunas',
          UPDATED_AT: trx.fn.now() });

      const totalDepositFinal = await trx('deposit')
        .where('IDINVOICE', angsuran.IDINVOICE)
        .andWhere('STATUS', 'AKTIF')
        .sum('SALDO_SISA as total')
        .first();

      await trx('invoice')
        .where('IDINVOICE', angsuran.IDINVOICE)
        .update({
          TOTALDEPOSIT: totalDepositFinal.total || 0,
          UPDATED_AT: trx.fn.now()
        });
    }

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

    const { IDINVOICE, NOMINAL } = angsuran;
    const invoice = await trx('invoice').where('IDINVOICE', IDINVOICE).first();
    if (!invoice) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Invoice tidak ditemukan' });
    }

    const penggunaan = await trx('deposit_penggunaan').where('IDINVOICE', IDINVOICE);
    for (const pakai of penggunaan) {
      await trx('deposit')
        .where('IDDEPOSIT', pakai.IDDEPOSIT)
        .increment('SALDO_SISA', pakai.JUMLAH_PEMAKAIAN)
        .update({ STATUS: 'AKTIF', UPDATED_AT: trx.fn.now() });
    }

    await trx('deposit_penggunaan').where('IDINVOICE', IDINVOICE).del();
    await trx('angsuran').where('IDANGSURAN', id).del();

    const totalSetelahHapus = (invoice.TOTALANGSURAN || 0) - NOMINAL;
    const sisaTagihanBaru = (invoice.SISA_TAGIHAN || 0) + NOMINAL;

    const totalDeposit = await trx('deposit')
      .where('IDINVOICE', IDINVOICE)
      .andWhere('STATUS', 'AKTIF')
      .sum('SALDO_SISA as total')
      .first();

    await trx('invoice')
      .where('IDINVOICE', IDINVOICE)
      .update({
        TOTALANGSURAN: totalSetelahHapus,
        SISA_TAGIHAN: sisaTagihanBaru,
        TOTALDEPOSIT: totalDeposit.total || 0,
        STATUS: sisaTagihanBaru <= 0 ? 'LUNAS' : 'BELUM_LUNAS',
        UPDATED_AT: trx.fn.now()
      });

    await trx.commit();
    res.json({ success: true, message: 'Angsuran berhasil dihapus dan deposit dikembalikan' });
  } catch (err) {
    await trx.rollback();
    console.error('Delete Angsuran Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}