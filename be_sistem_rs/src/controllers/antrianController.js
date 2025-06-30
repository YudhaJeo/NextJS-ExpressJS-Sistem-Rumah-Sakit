import * as Antrian from '../models/antrianModel.js';

export const getAllAntrian = async (req, res) => {
  try {
    const data = await Antrian.findAllAntrian();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data antrian', error: err.message });
  }
};

export const panggilAntrian = async (req, res) => {
  const { id } = req.params;
  try {
    await Antrian.updateStatusAntrian(id);
    res.json({ success: true, message: 'Antrian berhasil dipanggil' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal memanggil antrian', error: err.message });
  }
};