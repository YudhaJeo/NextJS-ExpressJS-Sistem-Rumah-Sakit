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
    const { NAMA_BANK, NO_REKENING, ATAS_NAMA, CABANG, KODE_BANK, STATUS, KETERANGAN } = req.body;

    if (!NAMA_BANK || !NO_REKENING || !ATAS_NAMA) {
      return res.status(400).json({ error: 'NAMA_BANK, NO_REKENING, dan ATAS_NAMA wajib diisi' });
    }

    const dataToInsert = {
      NAMA_BANK,
      NO_REKENING,
      ATAS_NAMA,
      CABANG: CABANG ?? '',
      KODE_BANK: KODE_BANK ?? '',
      STATUS: STATUS ?? 'AKTIF',
      KETERANGAN: KETERANGAN ?? '',
    };

    await BankModel.create(dataToInsert);
    res.json({ message: 'Rekening bank berhasil ditambahkan' });
  } catch (err) {
    console.error('CreateBank Error:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function updateBank(req, res) {
  try {
    const id = req.params.id;
    const { NAMA_BANK, NO_REKENING, ATAS_NAMA, CABANG, KODE_BANK, STATUS, KETERANGAN } = req.body;

    const dataToUpdate = {
      NAMA_BANK,
      NO_REKENING,
      ATAS_NAMA,
      CABANG: CABANG ?? '',
      KODE_BANK: KODE_BANK ?? '',
      STATUS: STATUS ?? 'AKTIF',
      KETERANGAN: KETERANGAN ?? '',
    };

    await BankModel.update(id, dataToUpdate);
    res.json({ message: 'Rekening bank berhasil diperbarui' });
  } catch (err) {
    console.error('UpdateBank Error:', err);
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

export async function getActiveBank(req, res) {
  try {
    const data = await BankModel.getActive();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}