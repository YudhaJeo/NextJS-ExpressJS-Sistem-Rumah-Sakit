import * as PenjualanModel from '../models/penjualanModel.js';

export const store = async (req, res) => {
  try {
    const { IDORDER, TOTAL, DETAIL } = req.body;

    const cek = await PenjualanModel.getPenjualanByOrder(IDORDER);
    if (cek) return res.status(400).json({ message: 'Order sudah diproses ke penjualan.' });

    const penjualan = {
      IDORDER,
      TOTAL,
      TGLPENJUALAN: new Date(),
      STATUS: 'LUNAS'
    };

    const detailItems = DETAIL.map(d => ({
      IDORDERDETAIL: d.IDDETAIL,
      IDOBAT: d.IDOBAT,
      QTY: d.QTY,
      HARGA: d.HARGA
    }));

    const id = await PenjualanModel.createPenjualan(penjualan, detailItems);

    res.status(201).json({ message: 'Penjualan berhasil', IDPENJUALAN: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menyimpan penjualan' });
  }
};

export const index = async (req, res) => {
  const data = await PenjualanModel.getPenjualan();
  res.json({ data });
};
