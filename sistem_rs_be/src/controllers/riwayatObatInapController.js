import * as RiwayatObatInap from '../models/riwayatObatInapModel';

export const getAll = async (req, res) => {
  try {
    const data = await RiwayatObatInap.getAll();
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const data = await RiwayatObatInap.getById(req.params.id);
    if (!data) return res.status(404).json({ status: 'not found' });
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getByRawatInapId = async (req, res) => {
  try {
    const data = await RiwayatObatInap.getByRawatInapId(req.params.id);
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
