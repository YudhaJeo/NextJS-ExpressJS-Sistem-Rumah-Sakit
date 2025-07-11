import * as DokterModel from '../models/datadokterModel.js';

export async function getAll(req, res) {
  try {
    const dokters = await DokterModel.getAll();
    res.json(dokters);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function getById(req, res) {
  try {
    const id = req.params.id;
    const dokter = await DokterModel.getById(id);
    if (!dokter) return res.status(404).json({ error: 'Dokter tidak ditemukan' });
    res.json(dokter);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function create(req, res) {
  try {
    const { IDDOKTER, IDPOLI, IDJADWAL, NO_TELEPON, EMAIL, ALAMAT, JENIS_KELAMIN } = req.body;

    if (!IDDOKTER || !EMAIL || !IDJADWAL || !JENIS_KELAMIN) {
      return res.status(400).json({ error: 'Field wajib tidak boleh kosong' });
    }

    await DokterModel.create({
      IDDOKTER,
      IDPOLI,
      IDJADWAL,
      NO_TELEPON,
      EMAIL,
      ALAMAT,
      JENIS_KELAMIN,
    });

    res.status(201).json({ message: 'Dokter berhasil ditambahkan' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function update(req, res) {
  try {
    const id = req.params.id;
    const { IDDOKTER, IDPOLI, IDJADWAL, NO_TELEPON, EMAIL, ALAMAT, JENIS_KELAMIN } = req.body;

    const updated = await DokterModel.update(id, {
      IDDOKTER,
      IDPOLI,
      IDJADWAL,
      NO_TELEPON,
      EMAIL,
      ALAMAT,
      JENIS_KELAMIN,
    });

    if (!updated) return res.status(404).json({ error: 'Dokter tidak ditemukan' });

    res.json({ message: 'Dokter berhasil diperbarui' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function remove(req, res) {
  try {
    const id = req.params.id;
    const deleted = await DokterModel.remove(id);
    if (!deleted) return res.status(404).json({ error: 'Dokter tidak ditemukan' });
    res.json({ message: 'Dokter berhasil dihapus' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
}
