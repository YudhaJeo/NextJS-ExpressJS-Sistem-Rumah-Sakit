import * as JenisBangsal from '../models/jenisBangsalModel.js';

export async function getAllJenisBangsal(req, res) {
  try {
    const data = await JenisBangsal.getAll();
    res.json({ data });
  } catch (err) {
    console.error('Gagal get jenis bangsal:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function createJenisBangsal(req, res) {
  try {
    const { NAMAJENIS, HARGAPERHARI, FASILITAS } = req.body;

    if (!NAMAJENIS) {
      return res.status(400).json({ error: 'Jenis bangsal wajib diisi' });
    }

    await JenisBangsal.create({ NAMAJENIS, HARGAPERHARI, FASILITAS });

    res.json({ message: 'Jenis bangsal berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateJenisBangsal(req, res) {
  try {
    const id = req.params.id;
    const { NAMAJENIS, HARGAPERHARI, FASILITAS } = req.body;

    const existing = await JenisBangsal.getById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Data jenis bangsal tidak ditemukan' });
    }

    await JenisBangsal.update(id, { NAMAJENIS, HARGAPERHARI, FASILITAS });
    res.json({ message: 'Jenis bangsal berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteJenisBangsal(req, res) {
  try {
    const id = req.params.id;

    const existing = await JenisBangsal.getById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Data jenis bangsal tidak ditemukan' });
    }

    await JenisBangsal.remove(id);
    res.json({ message: 'Jenis bangsal berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
