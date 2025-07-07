import * as InvoiceModel from '../models/invoiceModel.js';

export async function getAllInvoice(req, res) {
  try {
    const data = await InvoiceModel.getAll();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getInvoiceById(req, res) {
  try {
    const id = req.params.id;
    const data = await InvoiceModel.getById(id);

    if (!data) {
      return res.status(404).json({ error: 'Invoice tidak ditemukan' });
    }

    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createInvoice(req, res) {
  try {
    const {
      NOINVOICE,
      NIK,
      IDASURANSI,
      TANGGALINVOICE,
      TOTALTAGIHAN,
      STATUS,
    } = req.body;

    await InvoiceModel.create({
      NOINVOICE,
      NIK,
      IDASURANSI,
      TANGGALINVOICE,
      TOTALTAGIHAN,
      STATUS,
    });

    res.json({ message: 'Invoice berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateInvoice(req, res) {
  try {
    const id = req.params.id;
    const {
      NOINVOICE,
      NIK,
      IDASURANSI,
      TANGGALINVOICE,
      TOTALTAGIHAN,
      STATUS,
    } = req.body;

    console.log('Update ID:', id);
    console.log('Update Data:', req.body);

    const result = await InvoiceModel.update(id, {
      NOINVOICE,
      NIK,
      IDASURANSI,
      TANGGALINVOICE,
      TOTALTAGIHAN,
      STATUS,
    });

    if (!result) {
      return res.status(404).json({ error: 'Invoice tidak ditemukan' });
    }

    res.json({ message: 'Invoice berhasil diperbarui' });
  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function deleteInvoice(req, res) {
  try {
    const id = req.params.id;

    const result = await InvoiceModel.remove(id);
    if (!result) {
      return res.status(404).json({ error: 'Invoice tidak ditemukan' });
    }

    res.json({ message: 'Invoice berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}