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

    for (const dep of deposits) {
      if (sisaBayar <= 0) break;

      let pakai = Math.min(dep.SALDO_SISA, sisaBayar);
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
          IDINVOICE,
          JUMLAH_PEMAKAIAN: pakai,
          TANGGALPEMAKAIAN: trx.fn.now(),
          CREATED_AT: trx.fn.now(),
          UPDATED_AT: trx.fn.now()
        });
      }
    }

    const totalDeposit = await trx('deposit')
      .where('IDINVOICE', IDINVOICE)
      .sum('SALDO_SISA as total')
      .first();

    await trx('invoice')
      .where('IDINVOICE', IDINVOICE)
      .update({ TOTALDEPOSIT: totalDeposit.total || 0 });

    const tanggalBayar = new Date().toISOString();
    const NOANGSURAN = await generateNoAngsuran(tanggalBayar, trx);

    if (sisaBayar > 0) {
      if (METODE === 'Transfer Bank' && !IDBANK) {
        await trx.rollback();
        return res.status(400).json({ success: false, message: 'Bank wajib dipilih untuk Transfer Bank' });
      }

      await AngsuranModel.create({
        NOANGSURAN,
        IDINVOICE,
        NOMINAL: sisaBayar,
        METODE,
        IDBANK: METODE === 'Transfer Bank' ? IDBANK : null,
        KETERANGAN
      }, trx);

      const totalSetelahBayar = (invoice.TOTALANGSURAN || 0) + sisaBayar;
      const sisaTagihanBaru = invoice.SISA_TAGIHAN - NOMINAL;

      await trx('invoice')
        .where('IDINVOICE', IDINVOICE)
        .update({
          TOTALANGSURAN: totalSetelahBayar,
          SISA_TAGIHAN: sisaTagihanBaru,
          STATUS: sisaTagihanBaru <= 0 ? 'LUNAS' : 'BELUM_LUNAS',
          UPDATED_AT: trx.fn.now()
        });
    } else {
      await AngsuranModel.create({
        NOANGSURAN,
        IDINVOICE,
        NOMINAL: NOMINAL,
        METODE: 'Deposit',
        IDBANK: null,
        KETERANGAN: 'Pembayaran dengan deposit penuh'
      }, trx);

      const sisaTagihanBaru = invoice.SISA_TAGIHAN - NOMINAL;
      await trx('invoice')
        .where('IDINVOICE', IDINVOICE)
        .update({
          SISA_TAGIHAN: sisaTagihanBaru,
          STATUS: sisaTagihanBaru <= 0 ? 'LUNAS' : 'BELUM_LUNAS',
          UPDATED_AT: trx.fn.now()
        });
    }

    await trx.commit();
    res.status(201).json({ success: true, message: 'Angsuran berhasil ditambahkan (memakai deposit jika ada)' });
  } catch (err) {
    await trx.rollback();
    console.error('Create Angsuran Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateAngsuran(req, res) {
  const trx = await db.transaction();
  try {
    const { IDANGSURAN } = req.params;
    const { NOMINAL, METODE, IDBANK, KETERANGAN } = req.body;

    const angsuran = await trx('angsuran').where('IDANGSURAN', IDANGSURAN).first();
    if (!angsuran) {
      await trx.rollback();
      return res.status(404).json({ success: false, message: 'Angsuran tidak ditemukan' });
    }

    const invoice = await trx('invoice').where('IDINVOICE', angsuran.IDINVOICE).first();
    if (!invoice) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Invoice tidak ditemukan' });
    }

    let sisaTagihan = invoice.SISA_TAGIHAN + angsuran.NOMINAL;

    await trx('deposit_penggunaan').where('IDINVOICE', angsuran.IDINVOICE).del();

    let sisaBayar = NOMINAL;

    const deposits = await trx('deposit')
      .where('IDINVOICE', angsuran.IDINVOICE)
      .andWhere('STATUS', 'AKTIF');

    for (const dep of deposits) {
      if (sisaBayar <= 0) break;

      let pakai = Math.min(dep.SALDO_SISA, sisaBayar);
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
      }
    }

    if (sisaBayar > 0) {
      await trx('angsuran')
        .where('IDANGSURAN', IDANGSURAN)
        .update({
          NOMINAL: sisaBayar,
          METODE,
          IDBANK: METODE === 'Transfer Bank' ? IDBANK : null,
          KETERANGAN,
          UPDATED_AT: trx.fn.now()
        });
    } else {
      await trx('angsuran')
        .where('IDANGSURAN', IDANGSURAN)
        .update({
          NOMINAL,
          METODE: 'Deposit',
          IDBANK: null,
          KETERANGAN: 'Update angsuran menggunakan deposit penuh',
          UPDATED_AT: trx.fn.now()
        });
    }

    sisaTagihan -= NOMINAL;

    await trx('invoice')
      .where('IDINVOICE', angsuran.IDINVOICE)
      .update({
        SISA_TAGIHAN: sisaTagihan,
        STATUS: sisaTagihan <= 0 ? 'LUNAS' : 'BELUM_LUNAS',
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