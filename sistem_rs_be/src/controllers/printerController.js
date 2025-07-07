import * as PrinterModel from '../models/printerModel.js';

export async function getAllPrinter(req, res) {
  try {
    const data = await PrinterModel.getAll();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createPrinter(req, res) {
  try {
    const { NAMAPRINTER, KODEPRINTER, KETERANGAN } = req.body;
    await PrinterModel.create({ NAMAPRINTER, KODEPRINTER, KETERANGAN });
    res.json({ message: 'Printer berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updatePrinter(req, res) {
  try {
    const id = req.params.id;
    const { NAMAPRINTER, KODEPRINTER, KETERANGAN } = req.body;

    console.log('Update ID:', id);
    console.log('Update Data:', req.body); // debug output

    const result = await PrinterModel.update(id, { NAMAPRINTER, KODEPRINTER, KETERANGAN });

    res.json({ message: 'Printer berhasil diperbarui' });
  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function deletePrinter(req, res) {
  try {
    const id = req.params.id;
    await PrinterModel.remove(id);
    res.json({ message: 'Printer berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}