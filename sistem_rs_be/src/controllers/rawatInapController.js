import * as RawatInap from '../models/rawatInapModel.js';
import * as RiwayatRawatInap from '../models/riwayatInapModel.js';

const getAll = async (req, res) => {
  try {
    const data = await RawatInap.getAll();
    res.status(200).json({ data });
  } catch (err) {
    console.error('Error getAll:', err);
    res.status(500).json({ message: 'Gagal mengambil data rawat inap' });
  }
};

const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await RawatInap.getById(id);
    if (!data) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }
    res.status(200).json({ data });
  } catch (err) {
    console.error('Error getById:', err);
    res.status(500).json({ message: 'Gagal mengambil detail rawat inap' });
  }
};

const create = async (req, res) => {
  try {
    const { IDRAWATJALAN, IDBED, TANGGALMASUK, TANGGALKELUAR, CATATAN } = req.body;
    const inserted = await RawatInap.create({
      IDRAWATJALAN,
      IDBED,
      TANGGALMASUK,
      TANGGALKELUAR,
      CATATAN
    });
    res.status(200).json({ message: 'Data rawat inap berhasil ditambahkan', data: inserted });
  } catch (err) {
    console.error('Error create:', err);
    res.status(500).json({ message: 'Gagal menambahkan data rawat inap' });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const keluarSekarang = req.body.TANGGALKELUAR ?? null;

  try {
    const existing = await RawatInap.getById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    const updateData = {
      TANGGALKELUAR: keluarSekarang,
      STATUS: 'SELESAI',
      CATATAN: req.body.CATATAN ?? null
    };

    if (req.body.IDBED) {
      updateData.IDBED = req.body.IDBED;
    }

    if (req.body.TANGGALMASUK) {
      updateData.TANGGALMASUK = req.body.TANGGALMASUK;
    }

    await RawatInap.update(id, updateData);

    const updated = await RawatInap.getById(id);

    if (keluarSekarang && !existing.TANGGALKELUAR) {
      const obat = await RawatInap.getTotalObatInap(updated.IDRAWATINAP);
      const alkes = await RawatInap.getTotalAlkesInap(updated.IDRAWATINAP);
      const tindakan = await RawatInap.getTotalTindakanInap(updated.IDRAWATINAP);

      const TOTALOBAT = Number(obat.total) || 0;
      const TOTALALKES = Number(alkes.total) || 0;
      const TOTALTINDAKAN = Number(tindakan.total) || 0;
      const TOTALBIAYA = (updated.TOTALKAMAR || 0) + TOTALOBAT + TOTALALKES + TOTALTINDAKAN;

      const dataRiwayat = {
        IDRAWATINAP: updated.IDRAWATINAP,
        TANGGALMASUK: updated.TANGGALMASUK,
        TANGGALKELUAR: updated.TANGGALKELUAR,
        NOMORBED: updated.NOMORBED,
        TOTALKAMAR: updated.TOTALKAMAR || 0,
        TOTALOBAT,
        TOTALTINDAKAN,
        TOTALALKES,
        TOTALBIAYA,
      };

      await RiwayatRawatInap.insertFromRawatInap(dataRiwayat);
    }

    res.status(200).json({
      message: 'Data rawat inap berhasil diperbarui',
      data: updated
    });
  } catch (err) {
    console.error('Error update:', err);
    res.status(500).json({ message: 'Gagal memperbarui data rawat inap' });
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    await RawatInap.remove(id);
    res.status(200).json({ message: 'Data rawat inap berhasil dihapus' });
  } catch (err) {
    console.error('Error delete:', err);
    res.status(500).json({ message: 'Gagal menghapus data rawat inap' });
  }
};

const cancelCheckout = async (req, res) => {
  const { id } = req.params;
  try {
    await RawatInap.cancelCheckout(id);
    res.status(200).json({ message: 'Checkout berhasil dibatalkan' });
  } catch (err) {
    console.error('Error cancelCheckout:', err);
    res.status(500).json({ message: 'Gagal membatalkan checkout rawat inap' });
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  cancelCheckout,
  delete: remove
};
