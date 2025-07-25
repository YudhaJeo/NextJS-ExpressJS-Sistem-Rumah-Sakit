// src/controllers/obatInapController.js
import * as ObatInap from '../models/obatInapModel.js';
import * as Obat from '../models/obatModel.js';

export async function getAllObatInap(req, res) {
  try {
    const data = await ObatInap.getAll();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function insertObatInap(req, res) {
    try {
      const { IDRAWATINAP, IDOBAT, JUMLAH, HARGA, TOTAL } = req.body;
  
      const obat = await Obat.getById(IDOBAT);
      if (!obat) return res.status(404).json({ error: 'Obat tidak ditemukan' });
  
      if (HARGA !== obat.HARGA) {
        return res.status(400).json({ error: 'Harga satuan tidak sesuai dengan data obat' });
      }
  
      await ObatInap.create({
        IDRAWATINAP,
        IDOBAT,
        JUMLAH,
        HARGA,
        TOTAL,
      });
  
      res.json({ message: 'Data obat inap berhasil ditambahkan' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  

  export async function updateObatInap(req, res) {
    try {
      const id = req.params.id;
      const { JUMLAH } = req.body;
  
      const existing = await ObatInap.getById(id);
      if (!existing) return res.status(404).json({ error: 'Data tidak ditemukan' });
  
      const HARGA = existing.HARGA;
      const TOTAL = HARGA * JUMLAH;
  
      const data = { JUMLAH, TOTAL };
  
      await ObatInap.update(id, data); 
  
      res.json({ message: 'Data obat inap berhasil diperbarui' });
    } catch (err) {
      console.error('Update Error:', err);
      res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui data' });
    }
  }
  

export async function deleteObatInap(req, res) {
  try {
    const id = req.params.id;

    const existing = await ObatInap.getById(id);
    if (!existing) return res.status(404).json({ error: 'Data tidak ditemukan' });

    await ObatInap.remove(id);
    res.json({ message: 'Data berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
