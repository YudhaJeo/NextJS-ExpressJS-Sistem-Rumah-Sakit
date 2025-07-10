// src/controllers/bedController.js
import * as BedModel from '../models/bedModel.js';

export async function getAllBed(req, res) {
    try{
        const data = await BedModel.getAll();
        res.json({ data });
    } catch (err){
        console.error("Gagal get data bed", err)
        res.status(500).json({ error: 'Gagal mengambil data bed' })
    }   
}


export async function createBed(req, res) {
    try {
      const { NOMORBED, IDKAMAR, STATUS, KETERANGAN } = req.body;
  
      const existing = await BedModel.getByNomor(NOMORBED);
      if (existing) {
        return res.status(400).json({ error: 'Nomor Bed sudah terdaftar' });
      }
  
      await BedModel.create({
        NOMORBED,
        IDKAMAR,
        STATUS,
        KETERANGAN,
      });
  
      res.json({ message: 'Bed berhasil ditambahkan' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  
  export async function updateBed(req, res) {
    try {
      const { id } = req.params;
      const { NOMORBED, IDKAMAR, STATUS, KETERANGAN } = req.body;
  
      const updated = await BedModel.update(id, {
        NOMORBED,
        IDKAMAR,
        STATUS,
        KETERANGAN,
      });
  
      if (!updated) {
        return res.status(404).json({ error: 'bed tidak ditemukan' });
      }
  
      res.json({ message: 'Bed berhasil diperbarui' });
    } catch (err) {
      console.error('Gagal update bed:', err);
      res.status(500).json({ error: err.message });
    }
  }