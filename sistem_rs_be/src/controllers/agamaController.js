import * as Agama from '../models/agamaModel.js';

export async function getAllAgama(req, res) {
  try {
    const data = await Agama.getAll();
    res.json({ data });
  } catch (err) {
    console.error('Gagal get agama:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function createAgama(req, res) {
  try {
    const { NAMAAGAMA } = req.body;
    if (!NAMAAGAMA) {
      return res.status(400).json({ error: 'Nama agama wajib diisi' });
    }

    await Agama.create({ NAMAAGAMA });
    res.json({ message: 'Agama berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateAgama(req, res) {
  try {
    const id = req.params.id;
    const { NAMAAGAMA } = req.body;

    const existing = await Agama.getById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Data agama tidak ditemukan' });
    }

    await Agama.update(id, { NAMAAGAMA });
    res.json({ message: 'Agama berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteAgama(req, res) {
  try {
    const id = req.params.id;

    const existing = await Agama.getById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Data agama tidak ditemukan' });
    }

    await Agama.remove(id);
    res.json({ message: 'Agama berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
