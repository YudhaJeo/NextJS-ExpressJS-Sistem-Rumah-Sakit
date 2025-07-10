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