import * as JadwalDokterModel from '../models/jadwaldokterModel.js';

export async function getAll(req, res) {
  try {
    const jadwal = await JadwalDokterModel.getAll();
    res.json(jadwal);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function getById(req, res) {
  try {
    const id = req.params.id;
    const data = await JadwalDokterModel.getById(id);
    if (!data) return res.status(404).json({ error: 'Jadwal tidak ditemukan' });
    res.json(data);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function create(req, res) {
  try {
    const { IDDOKTER, HARI, JAM_MULAI, JAM_SELESAI } = req.body;

    if (!IDDOKTER || !HARI || !JAM_MULAI || !JAM_SELESAI) {
      return res.status(400).json({ error: 'Field wajib tidak boleh kosong' });
    }

    await JadwalDokterModel.create({
      IDDOKTER,
      HARI,
      JAM_MULAI,
      JAM_SELESAI,
    });

    res.status(201).json({ message: 'Jadwal dokter berhasil ditambahkan' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function update(req, res) {
  try {
    const id = req.params.id;
    const { IDDOKTER, HARI, JAM_MULAI, JAM_SELESAI } = req.body;

    const updated = await JadwalDokterModel.update(id, {
      IDDOKTER,
      HARI,
      JAM_MULAI,
      JAM_SELESAI,
    });

    if (!updated) return res.status(404).json({ error: 'Jadwal tidak ditemukan' });

    res.json({ message: 'Jadwal dokter berhasil diperbarui' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function remove(req, res) {
  try {
    const id = req.params.id;
    const deleted = await JadwalDokterModel.remove(id);
    if (!deleted) return res.status(404).json({ error: 'Jadwal tidak ditemukan' });
    res.json({ message: 'Jadwal dokter berhasil dihapus' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
}
