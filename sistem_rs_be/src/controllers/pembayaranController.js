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

    const deposits = await trx('deposit')
      .where('IDINVOICE', IDINVOICE)
      .andWhere('STATUS', 'AKTIF');

    let sisaTagihan = invoice.SISA_TAGIHAN;
    let sisaBayar = JUMLAHBAYAR;

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
      }
    }

    const totalDeposit = await trx('deposit')
      .where('IDINVOICE', IDINVOICE)
      .sum('SALDO_SISA as total')
      .first();

    await trx('invoice')
      .where('IDINVOICE', IDINVOICE)
      .update({ TOTALDEPOSIT: totalDeposit.total || 0 });

    if (sisaBayar > 0) {
      if (METODEPEMBAYARAN === 'Transfer Bank' && !IDBANK) {
        await trx.rollback();
        return res.status(400).json({ success: false, message: 'Bank wajib dipilih untuk Transfer Bank' });
      }

      const NOPEMBAYARAN = await generateNoPembayaran(
        TANGGALBAYAR || new Date().toISOString(),
        trx
      );

      const idBankFinal = METODEPEMBAYARAN === 'Transfer Bank' ? IDBANK : null;

      await PembayaranModel.create(
        {
          NOPEMBAYARAN,
          IDINVOICE,
          NIK,
          IDASURANSI: idAsuransi,
          TANGGALBAYAR: TANGGALBAYAR || db.fn.now(),
          METODEPEMBAYARAN,
          IDBANK: idBankFinal,
          JUMLAHBAYAR: sisaBayar,
          KETERANGAN
        },
        trx
      );

      sisaTagihan -= sisaBayar;
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
    const { id } = req.params;
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

    const pembayaranLama = await trx('pembayaran').where('IDPEMBAYARAN', id).first();
    if (!pembayaranLama) {
      await trx.rollback();
      return res.status(404).json({ success: false, message: 'Pembayaran tidak ditemukan' });
    }

    const invoice = await trx('invoice').where('IDINVOICE', IDINVOICE).first();
    if (!invoice) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Invoice tidak ditemukan' });
    }

    let sisaTagihan = invoice.SISA_TAGIHAN + pembayaranLama.JUMLAHBAYAR;

    await trx('pembayaran').where('IDPEMBAYARAN', id).del();

    const pasien = await trx('pasien').where('NIK', NIK).first();
    if (!pasien) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Pasien tidak ditemukan' });
    }
    let idAsuransi = IDASURANSI || pasien.IDASURANSI;

    const deposits = await trx('deposit')
      .where('IDINVOICE', IDINVOICE)
      .andWhere('STATUS', 'AKTIF');

    let sisaBayar = JUMLAHBAYAR;

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
      }
    }

    const totalDeposit = await trx('deposit')
      .where('IDINVOICE', IDINVOICE)
      .sum('SALDO_SISA as total')
      .first();

    await trx('invoice')
      .where('IDINVOICE', IDINVOICE)
      .update({ TOTALDEPOSIT: totalDeposit.total || 0 });

    if (sisaBayar > 0) {
      if (METODEPEMBAYARAN === 'Transfer Bank' && !IDBANK) {
        await trx.rollback();
        return res.status(400).json({ success: false, message: 'Bank wajib dipilih untuk Transfer Bank' });
      }

      const NOPEMBAYARAN = await generateNoPembayaran(
        TANGGALBAYAR || new Date().toISOString(),
        trx
      );

      await trx('pembayaran').insert({
        NOPEMBAYARAN,
        IDINVOICE,
        NIK,
        IDASURANSI: idAsuransi,
        TANGGALBAYAR: TANGGALBAYAR || db.fn.now(),
        METODEPEMBAYARAN,
        IDBANK: METODEPEMBAYARAN === 'Transfer Bank' ? IDBANK : null,
        JUMLAHBAYAR: sisaBayar,
        KETERANGAN,
        CREATED_AT: trx.fn.now(),
        UPDATED_AT: trx.fn.now()
      });

      sisaTagihan -= sisaBayar;
    }

    await trx('invoice')
      .where('IDINVOICE', IDINVOICE)
      .update({
        SISA_TAGIHAN: sisaTagihan,
        STATUS: sisaTagihan <= 0 ? 'LUNAS' : 'BELUM_LUNAS',
        UPDATED_AT: trx.fn.now()
      });

    await trx.commit();
    res.json({ success: true, message: 'Pembayaran berhasil diperbarui (deposit digunakan jika ada)' });
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

    const { IDINVOICE } = pembayaran;
    const invoice = await trx('invoice').where('IDINVOICE', IDINVOICE).first();
    if (!invoice) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Invoice tidak ditemukan' });
    }

    await trx('pembayaran').where('IDPEMBAYARAN', id).del();

    const sisaTagihan = invoice.SISA_TAGIHAN + pembayaran.JUMLAHBAYAR;

    await trx('invoice')
      .where('IDINVOICE', IDINVOICE)
      .update({
        SISA_TAGIHAN: sisaTagihan,
        STATUS: 'BELUM_LUNAS',
        UPDATED_AT: trx.fn.now()
      });

    await trx.commit();
    res.json({ success: true, message: 'Pembayaran berhasil dihapus' });
  } catch (err) {
    await trx.rollback();
    console.error('Delete Pembayaran Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}