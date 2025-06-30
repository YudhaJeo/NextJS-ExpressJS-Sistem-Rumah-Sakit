import * as Antrian from '../models/antrianModel.js';
import db from '../core/config/knex.js';

export const getAllAntrian = async (req, res) => {
  try {
    const data = await Antrian.findAllAntrian();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data antrian', error: err.message });
  }
};

export const createAntrian = async (req, res) => {
  try {
    const { LOKET } = req.body;

    // Cari detail loket berdasarkan nama (misalnya: "Pasien Umum")
    const loket = await db('loket').where({ NAMALOKET: LOKET }).first();

    if (!loket) {
      return res.status(404).json({ success: false, message: 'Loket tidak ditemukan' });
    }

    // Ambil jumlah antrian saat ini di loket tersebut
    const count = await db('antrian').where({ LOKET_ID: loket.NO }).count('ID as total');
    const total = count[0].total || 0;

    // Generate nomor antrian: ex: P001, U002
    const nextNumber = (total + 1).toString().padStart(3, '0');
    const NO_ANTRIAN = `${loket.KODE}${nextNumber}`;

    const newAntrian = {
      NO_ANTRIAN,
      LOKET_ID: loket.NO,
      STATUS: 'Belum'
    };

    await Antrian.createAntrian(newAntrian);

    res.json({ success: true, message: 'Antrian berhasil ditambahkan', data: newAntrian });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Gagal membuat antrian', error: err.message });
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