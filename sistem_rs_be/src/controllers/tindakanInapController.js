import * as TindakanInap from '../models/tindakanInapModel.js';

export async function getAllTindakanInap(req, res) {
  try {
    const data = await TindakanInap.getAll();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getTindakanInapByRawatInapId(req, res) {
  try {
    const { idRawatInap } = req.params;
    const data = await TindakanInap.getByRawatInapId(idRawatInap);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function insertTindakanInap(req, res) {
  try {
    const { 
      IDRAWATINAP, 
      IDOBAT, 
      IDTENAGAMEDIS, 
      WAKTUPEMBERIAN, 
      JUMLAH, 
      HARGA, 
      TOTAL 
    } = req.body;

    if (!IDRAWATINAP || !IDOBAT || !IDTENAGAMEDIS || !WAKTUPEMBERIAN || !JUMLAH || !HARGA || !TOTAL) {
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

    const formattedWaktu = dayjs(WAKTUPEMBERIAN).format('YYYY-MM-DD HH:mm:ss');

    await TindakanInap.create({
      IDRAWATINAP,
      IDOBAT,
      IDTENAGAMEDIS,
      WAKTUPEMBERIAN: formattedWaktu,
      JUMLAH,
      HARGA,
      TOTAL,
    });

    res.json({ message: 'Data tindakan inap berhasil ditambahkan' });
  } catch (err) {
    console.error("Insert Tindakan Inap Error:", err);
    res.status(500).json({ error: err.message });
  }
}

export async function deleteTindakanInap(req, res) {
  try {
    const id = req.params.id;

    const existing = await TindakanInap.getById(id);
    if (!existing) return res.status(404).json({ error: 'Data tidak ditemukan' });

    await TindakanInap.remove(id);
    res.json({ message: 'Data berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
