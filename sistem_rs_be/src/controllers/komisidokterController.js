import * as KomisiModel from '../models/komisidokterModel.js';

// Fungsi bantu untuk konversi tanggal ke format MySQL
function toMySQLDateTime(date) {
  if (!date) return null;
  const d = new Date(date);
  const pad = (n) => (n < 10 ? '0' + n : n);
  return (
    d.getFullYear() +
    '-' +
    pad(d.getMonth() + 1) +
    '-' +
    pad(d.getDate()) +
    ' ' +
    pad(d.getHours()) +
    ':' +
    pad(d.getMinutes()) +
    ':' +
    pad(d.getSeconds())
  );
}

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
    if (!komisi) return res.status(404).json({ error: 'komisi tidak ditemukan' });
    res.json(komisi);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function createKomisi(req, res) {
  try {
    const {
      IDDOKTER,
      TANGGAL_LAYANAN,
      NAMA_LAYANAN,
      BIAYA_LAYANAN,
      PERSENTASE_KOMISI,
      NILAI_KOMISI,
      STATUS,
      TANGGAL_PEMBAYARAN,
      KETERANGAN,
    } = req.body;

    if (
      !IDDOKTER ||
      !TANGGAL_LAYANAN ||
      !NAMA_LAYANAN ||
      !BIAYA_LAYANAN ||
      !PERSENTASE_KOMISI ||
      !NILAI_KOMISI ||
      !STATUS ||
      !TANGGAL_PEMBAYARAN ||
      !KETERANGAN
    ) {
      return res.status(400).json({ error: 'Field wajib tidak boleh kosong' });
    }

    await KomisiModel.createKomisi({
      IDDOKTER,
      TANGGAL_LAYANAN: toMySQLDateTime(TANGGAL_LAYANAN),
      NAMA_LAYANAN,
      BIAYA_LAYANAN,
      PERSENTASE_KOMISI,
      NILAI_KOMISI,
      STATUS,
      TANGGAL_PEMBAYARAN: toMySQLDateTime(TANGGAL_PEMBAYARAN),
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
      IDDOKTER,
      TANGGAL_LAYANAN,
      NAMA_LAYANAN,
      BIAYA_LAYANAN,
      PERSENTASE_KOMISI,
      NILAI_KOMISI,
      STATUS,
      TANGGAL_PEMBAYARAN,
      KETERANGAN,
    } = req.body;

    const updated = await KomisiModel.updateKomisi(id, {
      IDDOKTER,
      TANGGAL_LAYANAN: toMySQLDateTime(TANGGAL_LAYANAN),
      NAMA_LAYANAN,
      BIAYA_LAYANAN,
      PERSENTASE_KOMISI,
      NILAI_KOMISI,
      STATUS,
      TANGGAL_PEMBAYARAN: toMySQLDateTime(TANGGAL_PEMBAYARAN),
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
