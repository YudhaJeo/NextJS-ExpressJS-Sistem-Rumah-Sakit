// src/controllers/obatJalanController.js
import * as ObatJalan from '../models/obatJalanModel.js';
import * as Obat from '../models/obatModel.js';

export async function getAllObatJalan(req, res) {
  try {
    const data = await ObatJalan.getAll();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function insertObatJalan(req, res) {
    try {
      const { IDRAWATJALAN, IDOBAT, JUMLAH, HARGA, TOTAL } = req.body;
  
      const obat = await Obat.getById(IDOBAT);
      if (!obat) return res.status(404).json({ error: 'Obat tidak ditemukan' });
  
      if (HARGA !== obat.HARGAJUAL) {
        return res.status(400).json({ error: 'Harga satuan tidak sesuai dengan data obat' });
      }
  
      await ObatJalan.create({
        IDRAWATJALAN,
        IDOBAT,
        JUMLAH,
        HARGA,
        TOTAL,
      });
  
      res.json({ message: 'Data obat jalan berhasil ditambahkan' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  

  export async function updateObatJalan(req, res) {
    try {
      const id = req.params.id;
      const { JUMLAH } = req.body;
  
      const existing = await ObatJalan.getById(id);
      if (!existing) return res.status(404).json({ error: 'Data tidak ditemukan' });
  
      const HARGA = existing.HARGA;
      const TOTAL = HARGA * JUMLAH;
  
      const data = { JUMLAH, TOTAL };
  
      await ObatJalan.update(id, data); 
  
      res.json({ message: 'Data obat jalan berhasil diperbarui' });
    } catch (err) {
      console.error('Update Error:', err);
      res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui data' });
    }
  }
  

export async function deleteObatJalan(req, res) {
  try {
    const id = req.params.id;

    const existing = await ObatJalan.getById(id);
    if (!existing) return res.status(404).json({ error: 'Data tidak ditemukan' });

    await ObatJalan.remove(id);
    res.json({ message: 'Data berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
