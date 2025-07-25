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

    const newSaldo = deposit.SALDO_SISA - JUMLAH_PEMAKAIAN;

    await trx('deposit').where('IDDEPOSIT', IDDEPOSIT).update({
      SALDO_SISA: newSaldo,
      STATUS: newSaldo === 0 ? 'HABIS' : 'AKTIF',
    });

    await PenggunaanModel.create({
      IDDEPOSIT,
      IDINVOICE,
      TANGGALPEMAKAIAN: TANGGALPEMAKAIAN || db.fn.now(),
      JUMLAH_PEMAKAIAN,
    }, trx);

    await trx('invoice')
      .where('IDINVOICE', IDINVOICE)
      .decrement('TOTALTAGIHAN', JUMLAH_PEMAKAIAN)
      .update({ UPDATED_AT: db.fn.now() });

    const invoiceCheck = await trx('invoice').where('IDINVOICE', IDINVOICE).first();
    if (invoiceCheck.TOTALTAGIHAN < 0) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Total tagihan invoice tidak boleh negatif' });
    }

    await trx.commit();
    res.status(201).json({ success: true, message: 'Penggunaan deposit berhasil dicatat' });
  } catch (err) {
    await trx.rollback();
    console.error('Create Penggunaan Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function updatePenggunaan(req, res) {
  const trx = await db.transaction();
  try {
    const { id } = req.params;
    const { IDDEPOSIT, IDINVOICE, TANGGALPEMAKAIAN, JUMLAH_PEMAKAIAN } = req.body;

    const penggunaanLama = await trx('deposit_penggunaan').where('IDPENGGUNAAN', id).first();
    if (!penggunaanLama) {
      await trx.rollback();
      return res.status(404).json({ success: false, message: 'Data penggunaan tidak ditemukan' });
    }

    const depositLama = await trx('deposit').where('IDDEPOSIT', penggunaanLama.IDDEPOSIT).first();
    if (!depositLama) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Deposit lama tidak ditemukan' });
    }

    let saldoRollback = depositLama.SALDO_SISA + penggunaanLama.JUMLAH_PEMAKAIAN;

    if (penggunaanLama.IDDEPOSIT !== IDDEPOSIT) {
      await trx('deposit').where('IDDEPOSIT', penggunaanLama.IDDEPOSIT).update({
        SALDO_SISA: saldoRollback,
        STATUS: 'AKTIF',
      });

      const depositBaru = await trx('deposit').where('IDDEPOSIT', IDDEPOSIT).first();
      if (!depositBaru) {
        await trx.rollback();
        return res.status(400).json({ success: false, message: 'Deposit baru tidak ditemukan' });
      }
      saldoRollback = depositBaru.SALDO_SISA;
    }

    const saldoAkhir = saldoRollback - JUMLAH_PEMAKAIAN;
    if (saldoAkhir < 0) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Saldo deposit tidak mencukupi untuk update' });
    }

    await trx('deposit').where('IDDEPOSIT', IDDEPOSIT).update({
      SALDO_SISA: saldoAkhir,
      STATUS: saldoAkhir === 0 ? 'HABIS' : 'AKTIF',
    });

    await trx('invoice')
      .where('IDINVOICE', penggunaanLama.IDINVOICE)
      .increment('TOTALTAGIHAN', penggunaanLama.JUMLAH_PEMAKAIAN);

    if (penggunaanLama.IDINVOICE !== IDINVOICE) {
      await trx('invoice').where('IDINVOICE', IDINVOICE)
        .decrement('TOTALTAGIHAN', JUMLAH_PEMAKAIAN);
    } else {
      await trx('invoice').where('IDINVOICE', IDINVOICE)
        .decrement('TOTALTAGIHAN', JUMLAH_PEMAKAIAN);
    }

    const invoiceCheck = await trx('invoice').where('IDINVOICE', IDINVOICE).first();
    if (invoiceCheck.TOTALTAGIHAN < 0) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Total tagihan invoice tidak boleh negatif' });
    }

    await PenggunaanModel.update(id, {
      IDDEPOSIT,
      IDINVOICE,
      TANGGALPEMAKAIAN,
      JUMLAH_PEMAKAIAN,
      UPDATED_AT: db.fn.now(),
    }, trx);

    await trx.commit();
    res.status(200).json({ success: true, message: 'Data penggunaan berhasil diperbarui' });
  } catch (err) {
    await trx.rollback();
    console.error('Update Penggunaan Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function deletePenggunaan(req, res) {
  const trx = await db.transaction();
  try {
    const { id } = req.params;

    const penggunaan = await trx('deposit_penggunaan').where('IDPENGGUNAAN', id).first();
    if (!penggunaan) {
      await trx.rollback();
      return res.status(404).json({ success: false, message: 'Data penggunaan tidak ditemukan' });
    }

    const deposit = await trx('deposit').where('IDDEPOSIT', penggunaan.IDDEPOSIT).first();
    if (!deposit) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Deposit tidak ditemukan' });
    }

    const saldoBaru = deposit.SALDO_SISA + penggunaan.JUMLAH_PEMAKAIAN;

    await trx('deposit').where('IDDEPOSIT', penggunaan.IDDEPOSIT).update({
      SALDO_SISA: saldoBaru,
      STATUS: 'AKTIF',
    });

    await trx('invoice')
      .where('IDINVOICE', penggunaan.IDINVOICE)
      .increment('TOTALTAGIHAN', penggunaan.JUMLAH_PEMAKAIAN)
      .update({ UPDATED_AT: db.fn.now() });

    await PenggunaanModel.remove(id, trx);

    await trx.commit();
    res.status(200).json({ success: true, message: 'Data penggunaan berhasil dihapus' });
  } catch (err) {
    await trx.rollback();
    console.error('Delete Penggunaan Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}