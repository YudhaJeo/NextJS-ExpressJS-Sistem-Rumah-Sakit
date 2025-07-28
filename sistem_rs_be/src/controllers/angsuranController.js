import * as AngsuranModel from '../models/angsuranModel.js';
import db from '../core/config/knex.js';

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
    const {
      IDINVOICE,
      NOMINAL,
      METODE,
      IDBANK,
      KETERANGAN
    } = req.body;

    const invoice = await trx('invoice').where('IDINVOICE', IDINVOICE).first();
    if (!invoice) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Invoice tidak ditemukan' });
    }

    // Hitung total angsuran yang sudah dibayar
    const totalBayarSebelumnya = await trx('angsuran')
      .where('IDINVOICE', IDINVOICE)
      .sum({ total: 'NOMINAL' })
      .first();

    const sudahDibayar = parseFloat(totalBayarSebelumnya.total) || 0;
    const sisa = invoice.TOTALTAGIHAN - sudahDibayar;

    if (NOMINAL > sisa) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Nominal melebihi sisa tagihan' });
    }

    if (METODE === 'Transfer Bank' && !IDBANK) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Bank wajib dipilih untuk Transfer Bank' });
    }

    // Insert angsuran baru
    await AngsuranModel.create({
      IDINVOICE,
      NOMINAL,
      METODE,
      IDBANK: METODE === 'Transfer Bank' ? IDBANK : null,
      KETERANGAN
    }, trx);

    const totalSetelahBayar = sudahDibayar + NOMINAL;
    const statusBaru = totalSetelahBayar >= invoice.TOTALTAGIHAN ? 'LUNAS' : 'BELUM_LUNAS';

    // Update status invoice
    await trx('invoice').where('IDINVOICE', IDINVOICE).update({
      STATUS: statusBaru,
      UPDATED_AT: db.fn.now()
    });

    await trx.commit();
    res.status(201).json({ success: true, message: 'Angsuran berhasil ditambahkan' });
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
    const {
      IDINVOICE,
      NOMINAL,
      METODE,
      IDBANK,
      KETERANGAN
    } = req.body;

    const angsuranLama = await trx('angsuran').where('IDANGSURAN', id).first();
    if (!angsuranLama) {
      await trx.rollback();
      return res.status(404).json({ success: false, message: 'Angsuran tidak ditemukan' });
    }

    const invoice = await trx('invoice').where('IDINVOICE', IDINVOICE).first();
    if (!invoice) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Invoice tidak ditemukan' });
    }

    // Hitung total pembayaran selain angsuran ini
    const totalBayarLain = await trx('angsuran')
      .where('IDINVOICE', IDINVOICE)
      .andWhereNot('IDANGSURAN', id)
      .sum({ total: 'NOMINAL' })
      .first();

    const totalLain = parseFloat(totalBayarLain.total) || 0;
    const totalSetelahUpdate = totalLain + NOMINAL;

    if (totalSetelahUpdate > invoice.TOTALTAGIHAN) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Nominal total melebihi sisa tagihan' });
    }

    // Update angsuran
    await trx('angsuran').where('IDANGSURAN', id).update({
      NOMINAL,
      METODE,
      IDBANK: METODE === 'Transfer Bank' ? IDBANK : null,
      KETERANGAN,
      UPDATED_AT: trx.fn.now()
    });

    // Update status invoice berdasarkan total angsuran baru
    const statusBaru = totalSetelahUpdate >= invoice.TOTALTAGIHAN ? 'LUNAS' : 'BELUM_LUNAS';
    await trx('invoice').where('IDINVOICE', IDINVOICE).update({
      STATUS: statusBaru,
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

    const { IDINVOICE } = angsuran;

    // Hapus angsuran
    await trx('angsuran').where('IDANGSURAN', id).del();

    // Hitung ulang total angsuran tersisa
    const totalAngsuran = await trx('angsuran')
      .where('IDINVOICE', IDINVOICE)
      .sum({ total: 'NOMINAL' })
      .first();

    const totalBayar = parseFloat(totalAngsuran.total) || 0;

    const invoice = await trx('invoice').where('IDINVOICE', IDINVOICE).first();
    if (!invoice) {
      await trx.rollback();
      return res.status(400).json({ success: false, message: 'Invoice tidak ditemukan' });
    }

    // Perbarui status invoice
    const statusBaru = totalBayar >= invoice.TOTALTAGIHAN ? 'LUNAS' : 'BELUM_LUNAS';
    await trx('invoice').where('IDINVOICE', IDINVOICE).update({
      STATUS: statusBaru,
      UPDATED_AT: trx.fn.now()
    });

    await trx.commit();
    res.json({ success: true, message: 'Angsuran berhasil dihapus' });
  } catch (err) {
    await trx.rollback();
    console.error('Delete Angsuran Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}