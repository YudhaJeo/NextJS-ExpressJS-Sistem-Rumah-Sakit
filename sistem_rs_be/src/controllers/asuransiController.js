import * as Asuransi from '../models/asuransiModel.js';

export async function getAllAsuransi(req, res) {
    try {
      const data = await Asuransi.getAll();
    //   console.log('Data asuransi:', data);
      res.json({ data });
    } catch (err) {
      console.error('Gagal get asuransi:', err);
      res.status(500).json({ error: err.message });
    }
  }
  
export async function createAsuransi(req, res) {
  try {
    const { NAMAASURANSI, KETERANGAN } = req.body;

    if (!NAMAASURANSI) {
      return res.status(400).json({ error: 'Nama asuransi wajib diisi' });
    }

    await Asuransi.create({ NAMAASURANSI, KETERANGAN });

    res.json({ message: 'Asuransi berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateAsuransi(req, res) {
  try {
    const id = req.params.id;
    const { NAMAASURANSI, KETERANGAN } = req.body;

    const existing = await Asuransi.getById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Data asuransi tidak ditemukan' });
    }

    await Asuransi.update(id, { NAMAASURANSI, KETERANGAN });
    res.json({ message: 'Asuransi berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteAsuransi(req, res) {
  try {
    const id = req.params.id;

    const existing = await Asuransi.getById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Data asuransi tidak ditemukan' });
    }

    await Asuransi.remove(id);
    res.json({ message: 'Asuransi berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
