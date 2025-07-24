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

    const NOPEMBAYARAN = await generateNoPembayaran(
      TANGGALBAYAR || new Date().toISOString(),
      trx
    );

    const idBankFinal = METODEPEMBAYARAN === 'Transfer Bank' ? IDBANK : null;

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
        IDBANK: idBankFinal,
        JUMLAHBAYAR,
        KETERANGAN
      },
      trx 
    );

    await trx('invoice')
      .where('IDINVOICE', IDINVOICE)
      .update({ STATUS: 'LUNAS' });

    await trx.commit();
    res.status(201).json({
      success: true,
      message: 'Pembayaran berhasil ditambahkan',
      NOPEMBAYARAN 
    });
  } catch (err) {
    await trx.rollback();
    console.error('Create Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function updatePembayaran(req, res) {
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

    const invoice = await db('invoice').where('IDINVOICE', IDINVOICE).first();
    if (!invoice) {
      return res.status(400).json({ success: false, message: 'Invoice tidak ditemukan' });
    }

    const pasien = await db('pasien').where('NIK', NIK).first();
    if (!pasien) {
      return res.status(400).json({ success: false, message: 'Pasien tidak ditemukan' });
    }

    const idBankFinal = METODEPEMBAYARAN === 'Transfer Bank' ? IDBANK : null;
    
    let idAsuransi = IDASURANSI || pasien.IDASURANSI;

    const updated = await PembayaranModel.update(id, {
      IDINVOICE,
      NIK,
      IDASURANSI: idAsuransi,
      TANGGALBAYAR: TANGGALBAYAR || db.fn.now(),
      METODEPEMBAYARAN,
      IDBANK: idBankFinal,
      JUMLAHBAYAR,
      KETERANGAN
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Pembayaran tidak ditemukan' });
    }

    res.status(200).json({ success: true, message: 'Pembayaran berhasil diperbarui' });
  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function deletePembayaran(req, res) {
  try {
    const { id } = req.params;
    const deleted = await PembayaranModel.remove(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Pembayaran tidak ditemukan' });
    }

    res.status(200).json({ success: true, message: 'Pembayaran berhasil dihapus' });
  } catch (err) {
    console.error('Delete Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}