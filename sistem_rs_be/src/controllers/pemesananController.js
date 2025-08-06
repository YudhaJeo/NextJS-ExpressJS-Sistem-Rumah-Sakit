import * as PemesananModel from '../models/pemesananModel.js';

export const index = async (req, res) => {
  const data = await PemesananModel.getAllPemesanan();
  res.json({ data });
};

export const store = async (req, res) => {
  try {
    const { TGLPEMESANAN, SUPPLIERID, details } = req.body;

    const [inserted] = await PemesananModel.createPemesanan({
      TGLPEMESANAN,
      SUPPLIERID,
      STATUS: 'PENDING',
    });

    const id = inserted.IDPEMESANAN || inserted;

    const detailData = (details || []).map(d => ({
      IDPEMESANAN: id,
      JENISBARANG: d.JENISBARANG,
      IDBARANG: d.IDBARANG,
      QTY: d.QTY,
      HARGABELI: d.HARGABELI,
    }));

    if (detailData.length > 0) {
      await PemesananModel.createPemesananDetail(detailData);
    }

    res.json({ message: 'Pemesanan berhasil dibuat' });
  } catch (err) {
    console.error('Error Store Pemesanan:', err);
    res.status(500).json({ error: err.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { STATUS } = req.body;

    await PemesananModel.updatePemesananStatus(id, STATUS);
    res.json({ message: 'Status pemesanan diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const show = async (req, res) => {
  try {
    const { id } = req.params;
    const pemesanan = await PemesananModel.getAllPemesanan().where('IDPEMESANAN', id).first();
    if (!pemesanan) return res.status(404).json({ error: 'Pemesanan tidak ditemukan' });

    const details = await PemesananModel.getPemesananDetail(id);
    res.json({ pemesanan, details });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};