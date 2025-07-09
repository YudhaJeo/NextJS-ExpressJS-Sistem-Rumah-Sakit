import * as JadwalModel from '../models/jadwalpraktekModel.js';

export async function getAllJadwal(req, res) {
  try {
    const jadwals = await JadwalModel.getAllJadwal();
    res.json(jadwals);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function getByIdJadwal(req, res) {
  try {
    const id = req.params.id;
    const jadwal = await JadwalModel.getByIdJadwal(id);
    if (!jadwal) return res.status(404).json({ error: 'Jadwal tidak ditemukan' });
    res.json(jadwal);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function createJadwal(req, res) {
  try {
    const { IDDOKTER, POLI, HARI, JAM_MULAI, JAM_SELESAI } = req.body;

    if (!IDDOKTER || !POLI || !HARI || !JAM_MULAI || !JAM_SELESAI) {
      return res.status(400).json({ error: 'Field wajib tidak boleh kosong' });
    }

    await JadwalModel.createJadwal({
      IDDOKTER,
      POLI,
      HARI,
      JAM_MULAI,
      JAM_SELESAI,
    });

    res.status(201).json({ message: 'Jadwal berhasil ditambahkan' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function updateJadwal(req, res) {
  try {
    const id = req.params.id;
    const { IDDOKTER, POLI, HARI, JAM_MULAI, JAM_SELESAI } = req.body;

    const updated = await JadwalModel.updateJadwal(id, {
      IDDOKTER,
      POLI,
      HARI,
      JAM_MULAI,
      JAM_SELESAI,
    });

    if (!updated) return res.status(404).json({ error: 'Jadwal tidak ditemukan' });

    res.json({ message: 'Jadwal berhasil diperbarui' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function removeJadwal(req, res) {
  try {
    const id = req.params.id;
    const deleted = await JadwalModel.removeJadwal(id);
    if (!deleted) return res.status(404).json({ error: 'Jadwal tidak ditemukan' });
    res.json({ message: 'Jadwal berhasil dihapus' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
}
