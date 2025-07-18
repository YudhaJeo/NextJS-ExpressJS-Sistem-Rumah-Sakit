import * as PenggunaanModel from '../models/depositPenggunaanModel.js';
import db from '../core/config/knex.js';

export async function getAllPenggunaan(req, res) {
  try {
    const data = await PenggunaanModel.getAll();
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Get All Penggunaan Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getPenggunaanById(req, res) {
  try {
    const { id } = req.params;
    const penggunaan = await PenggunaanModel.getById(id);

    if (!penggunaan) {
      return res.status(404).json({ success: false, message: 'Data penggunaan tidak ditemukan' });
    }

    res.status(200).json({ success: true, data: penggunaan });
  } catch (err) {
    console.error('Get Penggunaan By ID Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function createPenggunaan(req, res) {
  const trx = await db.transaction();
  try {
    const { IDDEPOSIT, IDINVOICE, JUMLAH_PEMAKAIAN, TANGGALPEMAKAIAN } = req.body;

    const deposit = await trx('deposit').where('IDDEPOSIT', IDDEPOSIT).first();
    if (!deposit) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Deposit tidak ditemukan' });
    }

    if (deposit.SALDO_SISA < JUMLAH_PEMAKAIAN) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Saldo deposit tidak mencukupi' });
    }

    await trx('deposit')
      .where('IDDEPOSIT', IDDEPOSIT)
      .update({ SALDO_SISA: deposit.SALDO_SISA - JUMLAH_PEMAKAIAN });

    await PenggunaanModel.create({
      IDDEPOSIT,
      IDINVOICE,
      TANGGALPEMAKAIAN: TANGGALPEMAKAIAN || db.fn.now(),
      JUMLAH_PEMAKAIAN,
    }, trx);

    await trx.commit();
    res.status(201).json({ success: true, message: 'Penggunaan deposit berhasil dicatat' });
  } catch (err) {
    await trx.rollback();
    console.error('Create Penggunaan Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function updatePenggunaan(req, res) {
  try {
    const { id } = req.params;
    const { IDDEPOSIT, IDINVOICE, TANGGALPEMAKAIAN, JUMLAH_PEMAKAIAN } = req.body;

    const updated = await PenggunaanModel.update(id, {
      IDDEPOSIT,
      IDINVOICE,
      TANGGALPEMAKAIAN,
      JUMLAH_PEMAKAIAN,
      UPDATED_AT: db.fn.now(),
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Data penggunaan tidak ditemukan' });
    }

    res.status(200).json({ success: true, message: 'Data penggunaan berhasil diperbarui' });
  } catch (err) {
    console.error('Update Penggunaan Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function deletePenggunaan(req, res) {
  try {
    const { id } = req.params;
    const deleted = await PenggunaanModel.remove(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Data penggunaan tidak ditemukan' });
    }

    res.status(200).json({ success: true, message: 'Data penggunaan berhasil dihapus' });
  } catch (err) {
    console.error('Delete Penggunaan Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}