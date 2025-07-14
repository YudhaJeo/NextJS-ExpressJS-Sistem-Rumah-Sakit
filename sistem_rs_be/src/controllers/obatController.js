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