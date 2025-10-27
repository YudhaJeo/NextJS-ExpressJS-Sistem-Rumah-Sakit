import * as KritikSaranModel from '../models/kritikSaranModel.js';

export const getAllKritikSaran = async (req, res) => {
  try {
    const data = await KritikSaranModel.getAll();
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getKritikSaranById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await KritikSaranModel.getById(id);
    if (!data) return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
