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
    const loket = await db('loket').where({ NAMALOKET: LOKET }).first();

    if (!loket) {
      return res.status(404).json({ success: false, message: 'Loket tidak ditemukan' });
    }

    const last = await db('antrian')
      .where('LOKET_ID', loket.NO)
      .andWhere('NO_ANTRIAN', 'like', `${loket.KODE}%`)
      .orderBy('ID', 'desc')
      .first();

    let lastNo = 0;
    if (last && last.NO_ANTRIAN) {
      const match = last.NO_ANTRIAN.match(/\d+$/);
      if (match) {
        lastNo = parseInt(match[0], 10);
      }
    }

    const nextNo = lastNo + 1;
    const nomor = nextNo.toString().padStart(3, '0');
    const NO_ANTRIAN = `${loket.KODE}${nomor}`;

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

export const resetByLoket = async (req, res) => {
  const { loket } = req.body;

  if (!loket) {
    return res.status(400).json({ message: 'Loket harus diisi' });
  }

  try {
    const loketData = await db('loket').where({ NAMALOKET: loket }).first();

    if (!loketData) {
      return res.status(404).json({ message: 'Loket tidak ditemukan' });
    }

    await db('antrian')
      .where('LOKET_ID', loketData.NO)
      .del();

    return res.json({ message: `Antrian di Loket ${loket} berhasil direset dan akan mulai dari awal saat ditambah lagi.` });
  } catch (error) {
    console.error('Gagal reset antrian:', error);
    return res.status(500).json({ message: 'Gagal reset antrian' });
  }
};