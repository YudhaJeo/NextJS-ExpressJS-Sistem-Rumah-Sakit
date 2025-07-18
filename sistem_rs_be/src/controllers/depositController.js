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
    const { NIK, TANGGALDEPOSIT, NOMINAL, METODE, STATUS, KETERANGAN } = req.body;

    const pasien = await trx('pasien').where('NIK', NIK).first();
    if (!pasien) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Pasien tidak ditemukan' });
    }

    const tanggalDeposit = TANGGALDEPOSIT || new Date().toISOString().split('T')[0];
    const NODEPOSIT = await generateNoDeposit(tanggalDeposit, trx);

    await trx('deposit').insert({
      NODEPOSIT,
      NIK,
      TANGGALDEPOSIT: tanggalDeposit,
      NOMINAL,
      METODE,
      SALDO_SISA: NOMINAL, // default
      STATUS,
      KETERANGAN
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
  try {
    const { id } = req.params;
    const { NIK, TANGGALDEPOSIT, NOMINAL, METODE, SALDO_SISA, STATUS, KETERANGAN } = req.body;

    const pasien = await db('pasien').where('NIK', NIK).first();
    if (!pasien) {
      return res.status(400).json({ success: false, message: 'Pasien tidak ditemukan' });
    }

    const updated = await DepositModel.update(id, {
      NIK,
      TANGGALDEPOSIT: TANGGALDEPOSIT || db.fn.now(),
      NOMINAL,
      METODE,
      SALDO_SISA,
      STATUS,
      KETERANGAN
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Deposit tidak ditemukan' });
    }

    res.status(200).json({ success: true, message: 'Deposit berhasil diperbarui' });
  } catch (err) {
    console.error('Update Deposit Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteDeposit(req, res) {
  try {
    const { id } = req.params;
    const deleted = await DepositModel.remove(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Deposit tidak ditemukan' });
    }

    res.status(200).json({ success: true, message: 'Deposit berhasil dihapus' });
  } catch (err) {
    console.error('Delete Deposit Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getDepositOptions(req, res) {
  try {
    const rows = await db('deposit')
      .leftJoin('pasien', 'deposit.NIK', 'pasien.NIK') 
      .select(
        'deposit.IDDEPOSIT as value',
        db.raw('CONCAT("DEP-", deposit.IDDEPOSIT) as label'),
        'pasien.NIK',
        'pasien.NAMALENGKAP as NAMAPASIEN'
      );

    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error('Error getDepositOptions:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}