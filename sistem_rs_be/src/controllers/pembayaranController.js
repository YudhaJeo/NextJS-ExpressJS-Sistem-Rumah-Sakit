import * as PembayaranModel from '../models/pembayaranModel.js';
import db from '../core/config/knex.js';
import { generateNoPembayaran } from '../utils/generateNoPembayaran.js';

export async function getAllPembayaran(req, res) {
  try {
    const data = await PembayaranModel.getAll();
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Get All Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getPembayaranById(req, res) {
  try {
    const { id } = req.params;
    const pembayaran = await PembayaranModel.getById(id);

    if (!pembayaran) {
      return res.status(404).json({ success: false, message: 'Pembayaran tidak ditemukan' });
    }

    res.status(200).json({ success: true, data: pembayaran });
  } catch (err) {
    console.error('Get By ID Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function createPembayaran(req, res) {
  const trx = await db.transaction();
  try {
    const {
      IDINVOICE,
      NIK,
      IDASURANSI,
      TANGGALBAYAR,
      METODEPEMBAYARAN,
      IDBANK,
      JUMLAHBAYAR,
      KETERANGAN
    } = req.body;

    const invoice = await trx('invoice').where('IDINVOICE', IDINVOICE).first();
    if (!invoice) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Invoice tidak ditemukan' });
    }

    const pasien = await trx('pasien').where('NIK', NIK).first();
    if (!pasien) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Pasien tidak ditemukan' });
    }
    let idAsuransi = IDASURANSI || pasien.IDASURANSI;

    let sisaTagihan = invoice.SISA_TAGIHAN;
    let sisaBayar = JUMLAHBAYAR;

    const deposits = await trx('deposit')
      .where('IDINVOICE', IDINVOICE)
      .andWhere('STATUS', 'AKTIF');

    for (const dep of deposits) {
      if (sisaTagihan <= 0 || sisaBayar <= 0) break;

      let pakai = Math.min(dep.SALDO_SISA, sisaBayar, sisaTagihan);
      if (pakai > 0) {
        sisaTagihan -= pakai;
        sisaBayar -= pakai;

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

    const NOPEMBAYARAN = await generateNoPembayaran(
      TANGGALBAYAR || new Date().toISOString(),
      trx
    );

    if (sisaBayar > 0) {
      if (METODEPEMBAYARAN === 'Transfer Bank' && !IDBANK) {
        await trx.rollback();
        return res.status(400).json({ success: false, message: 'Bank wajib dipilih untuk Transfer Bank' });
      }

      await PembayaranModel.create(
        {
          NOPEMBAYARAN,
          IDINVOICE,
          NIK,
          IDASURANSI: idAsuransi,
          TANGGALBAYAR: TANGGALBAYAR || db.fn.now(),
          METODEPEMBAYARAN,
          IDBANK: METODEPEMBAYARAN === 'Transfer Bank' ? IDBANK : null,
          JUMLAHBAYAR: sisaBayar,
          KETERANGAN
        },
        trx
      );
    } else {
      await PembayaranModel.create(
        {
          NOPEMBAYARAN,
          IDINVOICE,
          NIK,
          IDASURANSI: idAsuransi,
          TANGGALBAYAR: TANGGALBAYAR || db.fn.now(),
          METODEPEMBAYARAN: 'Deposit',
          IDBANK: null,
          JUMLAHBAYAR: JUMLAHBAYAR,
          KETERANGAN: 'Pembayaran dengan deposit penuh'
        },
        trx
      );
    }

    await trx('invoice')
      .where('IDINVOICE', IDINVOICE)
      .update({
        SISA_TAGIHAN: sisaTagihan,
        STATUS: sisaTagihan <= 0 ? 'LUNAS' : 'BELUM_LUNAS',
        UPDATED_AT: trx.fn.now()
      });

    await trx.commit();
    res.status(201).json({
      success: true,
      message: 'Pembayaran berhasil ditambahkan (deposit digunakan jika ada)'
    });
  } catch (err) {
    await trx.rollback();
    console.error('Create Pembayaran Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function updatePembayaran(req, res) {
  const trx = await db.transaction();
  try {
    const { IDPEMBAYARAN } = req.params;
    const {
      NIK,
      IDASURANSI,
      TANGGALBAYAR,
      METODEPEMBAYARAN,
      IDBANK,
      JUMLAHBAYAR,
      KETERANGAN
    } = req.body;

    const pembayaran = await trx('pembayaran').where('IDPEMBAYARAN', IDPEMBAYARAN).first();
    if (!pembayaran) {
      await trx.rollback();
      return res.status(404).json({ success: false, message: 'Pembayaran tidak ditemukan' });
    }

    const invoice = await trx('invoice').where('IDINVOICE', pembayaran.IDINVOICE).first();
    if (!invoice) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Invoice tidak ditemukan' });
    }

    let sisaTagihan = invoice.SISA_TAGIHAN + pembayaran.JUMLAHBAYAR;

    await trx('deposit_penggunaan').where('IDINVOICE', pembayaran.IDINVOICE).del();

    let sisaBayar = JUMLAHBAYAR;

    const deposits = await trx('deposit')
      .where('IDINVOICE', pembayaran.IDINVOICE)
      .andWhere('STATUS', 'AKTIF');

    for (const dep of deposits) {
      if (sisaTagihan <= 0 || sisaBayar <= 0) break;

      let pakai = Math.min(dep.SALDO_SISA, sisaBayar, sisaTagihan);
      if (pakai > 0) {
        sisaTagihan -= pakai;
        sisaBayar -= pakai;

        await trx('deposit')
          .where('IDDEPOSIT', dep.IDDEPOSIT)
          .update({
            SALDO_SISA: dep.SALDO_SISA - pakai,
            STATUS: dep.SALDO_SISA - pakai <= 0 ? 'HABIS' : 'AKTIF',
            UPDATED_AT: trx.fn.now()
          });

        await trx('deposit_penggunaan').insert({
          IDDEPOSIT: dep.IDDEPOSIT,
          IDINVOICE: pembayaran.IDINVOICE,
          JUMLAH_PEMAKAIAN: pakai,
          TANGGALPEMAKAIAN: trx.fn.now(),
          CREATED_AT: trx.fn.now(),
          UPDATED_AT: trx.fn.now()
        });
      }
    }

    if (sisaBayar > 0) {
      await trx('pembayaran')
        .where('IDPEMBAYARAN', IDPEMBAYARAN)
        .update({
          NIK,
          IDASURANSI,
          TANGGALBAYAR,
          METODEPEMBAYARAN,
          IDBANK: METODEPEMBAYARAN === 'Transfer Bank' ? IDBANK : null,
          JUMLAHBAYAR: sisaBayar,
          KETERANGAN,
          UPDATED_AT: trx.fn.now()
        });
    } else {
      await trx('pembayaran')
        .where('IDPEMBAYARAN', IDPEMBAYARAN)
        .update({
          NIK,
          IDASURANSI,
          TANGGALBAYAR,
          METODEPEMBAYARAN: 'Deposit',
          IDBANK: null,
          JUMLAHBAYAR,
          KETERANGAN: 'Update pembayaran dengan deposit penuh',
          UPDATED_AT: trx.fn.now()
        });
    }

    await trx('invoice')
      .where('IDINVOICE', pembayaran.IDINVOICE)
      .update({
        SISA_TAGIHAN: sisaTagihan,
        STATUS: sisaTagihan <= 0 ? 'LUNAS' : 'BELUM_LUNAS',
        UPDATED_AT: trx.fn.now()
      });

    await trx.commit();
    res.json({ success: true, message: 'Pembayaran berhasil diperbarui' });
  } catch (err) {
    await trx.rollback();
    console.error('Update Pembayaran Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function deletePembayaran(req, res) {
  const trx = await db.transaction();
  try {
    const { id } = req.params;

    const pembayaran = await trx('pembayaran').where('IDPEMBAYARAN', id).first();
    if (!pembayaran) {
      await trx.rollback();
      return res.status(404).json({ success: false, message: 'Pembayaran tidak ditemukan' });
    }

    const { IDINVOICE, JUMLAHBAYAR } = pembayaran;
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

    await trx('pembayaran').where('IDPEMBAYARAN', id).del();

    let sisaTagihan = (invoice.SISA_TAGIHAN || 0) + JUMLAHBAYAR;

    const totalDeposit = await trx('deposit')
      .where('IDINVOICE', IDINVOICE)
      .sum('SALDO_SISA as total')
      .first();

    await trx('invoice')
      .where('IDINVOICE', IDINVOICE)
      .update({
        SISA_TAGIHAN: sisaTagihan,
        TOTALDEPOSIT: totalDeposit.total || 0,
        STATUS: sisaTagihan <= 0 ? 'LUNAS' : 'BELUM_LUNAS',
        UPDATED_AT: trx.fn.now()
      });

    await trx.commit();
    res.json({ success: true, message: 'Pembayaran berhasil dihapus dan deposit dikembalikan' });
  } catch (err) {
    await trx.rollback();
    console.error('Delete Pembayaran Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}