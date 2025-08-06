import * as Fefo from '../models/fefoModel.js';

export const index = async (req, res) => {
  try {
    const data = await Fefo.getAll();
    res.json({ status: 'success', data });
  } catch (err) {
    console.error('FEFO Index Error:', err);
    res.status(500).json({ status: 'error', message: 'Gagal ambil data FEFO' });
  }
};

export const updateStok = async (req, res) => {
  try {
    const { STOK } = req.body;
    await Fefo.updateStok(req.params.id, STOK);
    res.json({ status: 'success', message: 'Stok berhasil dikoreksi' });
  } catch (err) {
    console.error('FEFO Update Error:', err);
    res.status(500).json({ status: 'error', message: 'Gagal koreksi stok' });
  }
};

export const destroy = async (req, res) => {
  try {
    await Fefo.remove(req.params.id);
    res.json({ status: 'success', message: 'Batch FEFO dihapus' });
  } catch (err) {
    console.error('FEFO Delete Error:', err);
    res.status(500).json({ status: 'error', message: 'Gagal hapus batch FEFO' });
  }
};