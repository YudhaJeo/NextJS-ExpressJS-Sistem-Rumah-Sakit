import * as KomisiModel from '../models/komisidokterModel.js';

export async function getAllKomisi(req, res) {
  try {
    const komisi = await KomisiModel.getAllKomisi();
    res.json(komisi);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function getByIdKomisi(req, res) {
  try {
    const id = req.params.id;
    const komisi = await KomisiModel.getByIdKomisi(id);
    if (!komisi) return res.status(404).json({ error: 'Komisi tidak ditemukan' });
    res.json(komisi);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function createKomisi(req, res) {
  try {
    const {
      IDRAWATJALAN,
      NILAIKOMISI,
      STATUS,
      KETERANGAN
    } = req.body;

    if (
      !IDRAWATJALAN ||
      !NILAIKOMISI ||
      !STATUS
    ) {
      return res.status(400).json({ error: 'Field wajib tidak boleh kosong' });
    }

    await KomisiModel.createKomisi({
      IDRAWATJALAN,
      NILAIKOMISI,
      STATUS,
      KETERANGAN,
    });

    res.status(201).json({ message: 'Komisi berhasil ditambahkan' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function updateKomisi(req, res) {
  try {
    const id = req.params.id;
    const {
      IDRAWATJALAN,
      NILAIKOMISI,
      STATUS,
      KETERANGAN,
    } = req.body;

    const updated = await KomisiModel.updateKomisi(id, {
      IDRAWATJALAN,
      NILAIKOMISI,
      STATUS,
      KETERANGAN,
    });

    if (!updated) return res.status(404).json({ error: 'Komisi tidak ditemukan' });

    res.json({ message: 'Komisi berhasil diperbarui' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function removeKomisi(req, res) {
  try {
    const id = req.params.id;
    const deleted = await KomisiModel.removeKomisi(id);
    if (!deleted) return res.status(404).json({ error: 'Komisi tidak ditemukan' });
    res.json({ message: 'Komisi berhasil dihapus' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
}
