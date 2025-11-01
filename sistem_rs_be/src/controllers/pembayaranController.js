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
      IDBANK,
      JUMLAHBAYAR,
      METODEPEMBAYARAN,
      TANGGALBAYAR,
      JENIS_PEMBAYARAN,
    } = req.body;

    const invoice = await trx('invoice').where('IDINVOICE', IDINVOICE).first();
    const pasien = await trx('pasien')
      .where('NIK', NIK)
      .leftJoin('asuransi', 'pasien.IDASURANSI', 'asuransi.IDASURANSI')
      .select('pasien.*', 'asuransi.NAMAASURANSI', 'asuransi.IDASURANSI')
      .first();

    if (!invoice) {
      await trx.rollback();
      return res.status(404).json({ success: false, message: 'Invoice tidak ditemukan.' });
    }

    if (!pasien) {
      await trx.rollback();
      return res.status(404).json({ success: false, message: 'Pasien tidak ditemukan.' });
    }

    const jumlahBayarOtomatis = invoice.SISA_TAGIHAN || invoice.TOTALTAGIHAN;

    if (pasien.NAMAASURANSI !== 'Umum' && JENIS_PEMBAYARAN === 'ASURANSI') {
      const NOPEMBAYARAN = await generateNoPembayaran(TANGGALBAYAR || new Date().toISOString(), trx);

      await trx('pembayaran').insert({
        NOPEMBAYARAN,
        IDINVOICE,
        NIK,
        IDASURANSI: pasien.IDASURANSI,
        TANGGALBAYAR: TANGGALBAYAR || trx.fn.now(),
        METODEPEMBAYARAN: 'Asuransi',
        IDBANK: null,
        JUMLAHBAYAR: jumlahBayarOtomatis,
        KETERANGAN: 'Pembayaran dicover oleh asuransi',
        CREATED_AT: trx.fn.now(),
        UPDATED_AT: trx.fn.now(),
      });

      await trx('invoice')
        .where('IDINVOICE', IDINVOICE)
        .update({
          SISA_TAGIHAN: 0,
          STATUS: 'LUNAS',
          UPDATED_AT: trx.fn.now(),
        });

      await trx.commit();
      return res.status(201).json({
        success: true,
        message: 'Invoice dicover oleh asuransi dan ditandai lunas.',
      });
    }

    if (pasien.NAMAASURANSI === 'Umum' && METODEPEMBAYARAN !== 'Deposit') {
      const NOPEMBAYARAN = await generateNoPembayaran(TANGGALBAYAR || new Date().toISOString(), trx);

      await trx('pembayaran').insert({
        NOPEMBAYARAN,
        IDINVOICE,
        NIK,
        IDASURANSI: null,
        TANGGALBAYAR: TANGGALBAYAR || trx.fn.now(),
        METODEPEMBAYARAN: METODEPEMBAYARAN || 'Tunai',
        IDBANK: METODEPEMBAYARAN === 'Transfer Bank' ? IDBANK : null,
        JUMLAHBAYAR: jumlahBayarOtomatis,
        KETERANGAN: 'Pembayaran pasien umum secara lunas',
        CREATED_AT: trx.fn.now(),
        UPDATED_AT: trx.fn.now(),
      });

      await trx('invoice')
        .where('IDINVOICE', IDINVOICE)
        .update({
          SISA_TAGIHAN: 0,
          STATUS: 'LUNAS',
          UPDATED_AT: trx.fn.now(),
        });

      await trx.commit();
      return res.status(201).json({
        success: true,
        message: 'Pembayaran pasien umum berhasil, invoice otomatis lunas.',
      });
    }

    if (METODEPEMBAYARAN === 'Deposit') {
      const NOPEMBAYARAN = await generateNoPembayaran(TANGGALBAYAR || new Date().toISOString(), trx);

      const totalDepositSaldo = await trx('deposit')
        .where('IDINVOICE', IDINVOICE)
        .andWhere('SALDO_SISA', '>', 0)
        .sum('SALDO_SISA as total')
        .first();

      const saldoDeposit = Number(totalDepositSaldo.total) || 0;

      if (saldoDeposit < jumlahBayarOtomatis) {
        await trx.rollback();
        return res.status(400).json({
          success: false,
          message: `Saldo deposit tidak mencukupi (Rp ${saldoDeposit.toLocaleString(
            'id-ID'
          )}). Silakan pilih metode pembayaran lain.`,
        });
      }

      const deposits = await trx('deposit')
        .where('IDINVOICE', IDINVOICE)
        .andWhere('SALDO_SISA', '>', 0)
        .orderBy('IDDEPOSIT', 'asc');

      let sisaBayar = jumlahBayarOtomatis;
      let totalDikurangi = 0;

      for (const dep of deposits) {
        if (sisaBayar <= 0) break;

        const pakai = Math.min(dep.SALDO_SISA, sisaBayar);
        const saldoBaru = dep.SALDO_SISA - pakai;

        await trx('deposit')
          .where('IDDEPOSIT', dep.IDDEPOSIT)
          .update({
            SALDO_SISA: saldoBaru,
            STATUS: saldoBaru <= 0 ? 'HABIS' : 'AKTIF',
            UPDATED_AT: trx.fn.now(),
          });

        await trx('deposit_penggunaan').insert({
          IDDEPOSIT: dep.IDDEPOSIT,
          IDINVOICE,
          JUMLAH_PEMAKAIAN: pakai,
          TANGGALPEMAKAIAN: trx.fn.now(),
          CREATED_AT: trx.fn.now(),
          UPDATED_AT: trx.fn.now(),
        });

        totalDikurangi += pakai;
        sisaBayar -= pakai;
      }

      await trx('pembayaran').insert({
        NOPEMBAYARAN,
        IDINVOICE,
        NIK,
        IDASURANSI: pasien.IDASURANSI || null,
        TANGGALBAYAR: TANGGALBAYAR || trx.fn.now(),
        METODEPEMBAYARAN: 'Deposit',
        IDBANK: null,
        JUMLAHBAYAR: jumlahBayarOtomatis,
        KETERANGAN: 'Pembayaran menggunakan deposit',
        CREATED_AT: trx.fn.now(),
        UPDATED_AT: trx.fn.now(),
      });

      await trx('invoice')
        .where('IDINVOICE', IDINVOICE)
        .update({
          SISA_TAGIHAN: 0,
          STATUS: 'LUNAS',
          UPDATED_AT: trx.fn.now(),
        });

      const totalDeposit = await trx('deposit')
        .where('IDINVOICE', IDINVOICE)
        .andWhere('STATUS', 'AKTIF')
        .sum('SALDO_SISA as total')
        .first();

      await trx('invoice')
        .where('IDINVOICE', IDINVOICE)
        .update({
          TOTALDEPOSIT: totalDeposit.total || 0,
          UPDATED_AT: trx.fn.now(),
        });

      await trx.commit();
      return res.status(201).json({
        success: true,
        message: 'Pembayaran via deposit berhasil, saldo deposit berkurang otomatis dan invoice lunas.',
      });
    }

    const NOPEMBAYARAN = await generateNoPembayaran(TANGGALBAYAR || new Date().toISOString(), trx);
    await trx('pembayaran').insert({
      NOPEMBAYARAN,
      IDINVOICE,
      NIK,
      TANGGALBAYAR: TANGGALBAYAR || trx.fn.now(),
      METODEPEMBAYARAN,
      IDBANK: METODEPEMBAYARAN === 'Transfer Bank' ? IDBANK : null,
      JUMLAHBAYAR,
      KETERANGAN: 'Pembayaran pasien asuransi secara lunas',
      CREATED_AT: trx.fn.now(),
      UPDATED_AT: trx.fn.now(),
    });

    await trx('invoice')
      .where('IDINVOICE', IDINVOICE)
      .update({
        SISA_TAGIHAN: Math.max(invoice.SISA_TAGIHAN - JUMLAHBAYAR, 0),
        STATUS: invoice.SISA_TAGIHAN - JUMLAHBAYAR <= 0 ? 'LUNAS' : 'BELUM_LUNAS',
        UPDATED_AT: trx.fn.now(),
      });

    await trx.commit();
    res.status(201).json({ success: true, message: 'Pembayaran berhasil disimpan.' });
  } catch (error) {
    console.error('Create Pembayaran Error:', error);
    await trx.rollback();
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan pembayaran.',
      error: error.message,
    });
  }
}

export async function updatePembayaran(req, res) {
  const trx = await db.transaction();
  try {
    const { IDPEMBAYARAN } = req.params;
    const { NIK, IDASURANSI, TANGGALBAYAR, METODEPEMBAYARAN, IDBANK, JUMLAHBAYAR, KETERANGAN } = req.body;

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
    const deposits = await trx('deposit').where('IDINVOICE', pembayaran.IDINVOICE).andWhere('STATUS', 'AKTIF');

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
            UPDATED_AT: trx.fn.now(),
          });

        await trx('deposit_penggunaan').insert({
          IDDEPOSIT: dep.IDDEPOSIT,
          IDINVOICE: pembayaran.IDINVOICE,
          JUMLAH_PEMAKAIAN: pakai,
          TANGGALPEMAKAIAN: trx.fn.now(),
          CREATED_AT: trx.fn.now(),
          UPDATED_AT: trx.fn.now(),
        });
      }
    }

    await trx('pembayaran')
      .where('IDPEMBAYARAN', IDPEMBAYARAN)
      .update({
        NIK,
        IDASURANSI,
        TANGGALBAYAR,
        METODEPEMBAYARAN,
        IDBANK: METODEPEMBAYARAN === 'Transfer Bank' ? IDBANK : null,
        JUMLAHBAYAR,
        KETERANGAN,
        UPDATED_AT: trx.fn.now(),
      });

    await trx('invoice')
      .where('IDINVOICE', pembayaran.IDINVOICE)
      .update({
        SISA_TAGIHAN: sisaTagihan,
        STATUS: sisaTagihan <= 0 ? 'LUNAS' : 'BELUM_LUNAS',
        UPDATED_AT: trx.fn.now(),
      });

    const totalDeposit = await trx('deposit')
      .where('IDINVOICE', pembayaran.IDINVOICE)
      .sum('SALDO_SISA as total')
      .first();

    await trx('invoice')
      .where('IDINVOICE', pembayaran.IDINVOICE)
      .update({
        TOTALDEPOSIT: totalDeposit.total || 0,
        UPDATED_AT: trx.fn.now(),
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
        UPDATED_AT: trx.fn.now(),
      });

    await trx.commit();
    res.json({ success: true, message: 'Pembayaran berhasil dihapus dan deposit dikembalikan' });
  } catch (err) {
    await trx.rollback();
    console.error('Delete Pembayaran Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}