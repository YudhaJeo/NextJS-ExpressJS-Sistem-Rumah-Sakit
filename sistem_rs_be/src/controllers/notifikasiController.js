// D:\MARSTECH\NextJS-ExpressJS-Final-System\sistem_rs_be\src\controllers\notifikasiController.js
import * as NotifikasiModel from '../models/notifikasiModel.js';

export async function getAllNotifikasi(req, res) {
  try {
    const data = await NotifikasiModel.getAll();
    res.json({ data });
  } catch (err) {
    console.error('GetAll Error:', err.message);
    res.status(500).json({ error: err.message });
  }
}