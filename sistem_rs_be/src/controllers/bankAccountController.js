import * as BankModel from '../models/bankAccountModel.js';

export async function getAllBank(req, res) {
  try {
    const data = await BankModel.getAll();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createBank(req, res) {
  try {
    const { NAMA_BANK, NO_REKENING, ATAS_NAMA, CABANG, KODE_BANK, STATUS, CATATAN } = req.body;
    await BankModel.create({ NAMA_BANK, NO_REKENING, ATAS_NAMA, CABANG, KODE_BANK, STATUS, CATATAN });
    res.json({ message: 'Rekening bank berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateBank(req, res) {
  try {
    const id = req.params.id;
    const { NAMA_BANK, NO_REKENING, ATAS_NAMA, CABANG, KODE_BANK, STATUS, CATATAN } = req.body;
    await BankModel.update(id, { NAMA_BANK, NO_REKENING, ATAS_NAMA, CABANG, KODE_BANK, STATUS, CATATAN });
    res.json({ message: 'Rekening bank berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteBank(req, res) {
  try {
    const id = req.params.id;
    await BankModel.remove(id);
    res.json({ message: 'Rekening bank berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}