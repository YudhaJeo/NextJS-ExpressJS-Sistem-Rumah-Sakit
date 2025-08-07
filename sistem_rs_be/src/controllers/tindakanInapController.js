import * as TindakanInap from '../models/tindakanInapModel.js';
import * as Tindakan from '../models/tindakanModel.js';

export async function getAllTindakanInap(req, res) {
  try {
    const data = await TindakanInap.getAll();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function insertTindakanInap(req, res) {
  try {
    const { IDRAWATINAP, IDTINDAKAN, JUMLAH, HARGA, TOTAL } = req.body;

    const tindakan = await Tindakan.getById(IDTINDAKAN);
    if (!tindakan) return res.status(404).json({ error: 'Tindakan tidak ditemukan' });

    if (HARGA !== tindakan.HARGA) {
      return res.status(400).json({ error: 'Harga tidak sesuai dengan data tindakan' });
    }

    await TindakanInap.create({
      IDRAWATINAP,
      IDTINDAKAN,
      JUMLAH,
      HARGA,
      TOTAL,
    });

    res.json({ message: 'Data tindakan inap berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


export async function updateTindakanInap(req, res) {
  try {
    const { id } = req.params;
    const { IDTINDAKAN, JUMLAH } = req.body;

    if (!IDTINDAKAN || !JUMLAH || isNaN(JUMLAH)) {
      return res.status(400).json({ error: 'IDTINDAKAN dan JUMLAH wajib diisi dan jumlah harus angka' });
    }

    const tindakanBaru = await Tindakan.getById(IDTINDAKAN);
    if (!tindakanBaru) {
      return res.status(404).json({ error: 'Tindakan tidak ditemukan' });
    }

    const HARGA = tindakanBaru.HARGA;
    const TOTAL = HARGA * JUMLAH;

    const data = {
      IDTINDAKAN,
      JUMLAH,
      HARGA,
      TOTAL,
    };

    await TindakanInap.update(id, data);

    res.json({ message: 'Data tindakan inap berhasil diperbarui' });
  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui data' });
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
