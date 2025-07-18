// src\controllers\tagihanSementaraController.js
import * as TagihanModel from '../models/tagihanSementaraModel.js';

const getAll = async (req, res) => {
  try {
    const data = await TagihanModel.getAllTagihanSementara();
    res.status(200).json({ data });
  } catch (err) {
    console.error('Gagal ambil semua tagihan sementara:', err);
    res.status(500).json({ message: 'Gagal mengambil data tagihan sementara' });
  }
};

export default {
  getAll
};
