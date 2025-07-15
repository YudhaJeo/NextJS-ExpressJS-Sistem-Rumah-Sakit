// src/controllers/obatController.js
import * as Obat from '../models/obatModel.js';

export async function getAllObat(req, res) {
    try{
        const data = await Obat.getAll();
        res.json({ data });
    } catch (err) {
        console.error('Gagal mengambil data obat: ', err);
        res.status(500).json({ error: err.message });
    }   
}

export async function insertObat(req, res) {
    try{
        const { NAMAOBAT, SATUAN, STOK, HARGA, KETERANGAN } = req.body;
        await Obat.createObat({ NAMAOBAT, SATUAN, STOK, HARGA, KETERANGAN });
        res.json({ message: 'Jenis bangsal berhasil ditambahkan' });
    } catch (err) {
        console.error('Gagal insert data obat: ', err)
        res.status(500).json({ error: err.message })
    }
}

export async function updateObat(req, res) {
    try{
        const id = req.params.id;
        const { NAMAOBAT, SATUAN, STOK, HARGA, KETERANGAN } = req.body;
        const existing = await Obat.getById(id);

        if (!existing) {
            return res.status(404).json({ error: 'Data obat tidak ditemukan' });
        }
        
        await Obat.updateObat(id, { NAMAOBAT, SATUAN, STOK, HARGA, KETERANGAN });
        res.json({ message: 'Jenis obat berhasil diperbarui' });
    } catch(err){
        res.status(500).json({ error: err.message })
    }
   
}

export async function deleteObat(req, res) {
    try {
      const id = req.params.id;
  
      const existing = await Obat.getById(id);
      if (!existing) {
        return res.status(404).json({ error: 'Data tidak ditemukan' });
      }
  
      await Obat.remove(id);
      res.json({ message: 'Data berhasil dihapus' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  