import * as TindakanJalan from '../models/tindakanJalanModel.js';
import * as Tindakan from '../models/tindakanModel.js';

export async function getAllTindakanJalan(req, res) {
  try {
    const data = await TindakanJalan.getAll();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function insertTindakanJalan(req, res) {
  try {
    const { IDRAWATJALAN, IDTINDAKAN, JUMLAH, HARGA, TOTAL } = req.body;

    const tindakan = await Tindakan.getById(IDTINDAKAN);
    if (!tindakan) return res.status(404).json({ error: 'Tindakan tidak ditemukan' });

    if (HARGA !== tindakan.HARGA) {
      return res.status(400).json({ error: 'Harga tidak sesuai dengan data tindakan' });
    }

    await TindakanJalan.create({
      IDRAWATJALAN,
      IDTINDAKAN,
      JUMLAH,
      HARGA,
      TOTAL,
    });

    res.json({ message: 'Data tindakan jalan berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


export async function updateTindakanJalan(req, res) {
  try {
    const id = req.params.id;
    const { JUMLAH } = req.body;

    const existing = await TindakanJalan.getById(id);
    if (!existing) return res.status(404).json({ error: 'Data tidak ditemukan' });

    const HARGA = existing.HARGA;
    const TOTAL = HARGA * JUMLAH;

    const data = { JUMLAH, TOTAL };

    await TindakanJalan.update(id, data);

    res.json({ message: 'Data tindakan jalan berhasil diperbarui' });
  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui data' });
  }
}


export async function deleteTindakanJalan(req, res) {
  try {
    const id = req.params.id;

    const existing = await TindakanJalan.getById(id);
    if (!existing) return res.status(404).json({ error: 'Data tidak ditemukan' });

    await TindakanJalan.remove(id);
    res.json({ message: 'Data berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
