import * as RiwayatTindakanInap from '../models/riwayatTindakanInapModel';

export const getAll = async (req, res) => {
  try {
    const data = await RiwayatTindakanInap.getAll();
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const data = await RiwayatTindakanInap.getById(req.params.id);
    if (!data) return res.status(404).json({ status: 'not found' });
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getByRawatInapId = async (req, res) => {
  try {
    const data = await RiwayatTindakanInap.getByRawatInapId(req.params.id);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};