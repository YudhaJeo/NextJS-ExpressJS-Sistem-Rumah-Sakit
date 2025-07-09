import * as AntrianPoli from '../models/antrianPoliModel.js';
import db from '../core/config/knex.js';

export const getAllAntrianPoli = async (req, res) => {
  try {
    const data = await AntrianPoli.findAllAntrianPoli();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data antrian poli', error: err.message });
  }
};

export const createAntrianPoli = async (req, res) => {
  try {
    const { POLI } = req.body;

    const poli = await db('poli').where({ NAMAPOLI: POLI }).first();

    if (!poli) {
      return res.status(404).json({ success: false, message: 'Poli tidak ditemukan' });
    }

    const last = await db('antrian_poli')
      .where('POLI_ID', poli.IDPOLI)
      .andWhere('NO_ANTRIAN', 'like', `${poli.KODE}%`)
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
    const NO_ANTRIAN = `${poli.KODE}${nomor}`;

    const newAntrian = {
      NO_ANTRIAN,
      POLI_ID: poli.IDPOLI,
      STATUS: 'Belum',
    };

    await AntrianPoli.createAntrianPoli(newAntrian);

    res.json({ success: true, message: 'Antrian poli berhasil ditambahkan', data: newAntrian });
  } catch (err) {
    console.error("❌ Error createAntrianPoli:", err);
    res.status(500).json({ success: false, message: 'Gagal membuat antrian poli', error: err.message });
  }
};

export const panggilAntrianPoli = async (req, res) => {
  const { id } = req.params;
  try {
    await AntrianPoli.updateStatusAntrianPoli(id);

    const broadcastUpdate = req.app.get('broadcastUpdate');
    if (broadcastUpdate) {
      broadcastUpdate(); 
    }
    res.json({ success: true, message: 'Antrian poli berhasil dipanggil' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal memanggil antrian poli', error: err.message });
  }
};

export const resetByPoli = async (req, res) => {
  const { poli } = req.body;

  if (!poli) {
    return res.status(400).json({ message: 'Nama poli harus diisi' });
  }

  try {
    const poliData = await db('poli').where({ NAMAPOLI: poli }).first();

    if (!poliData) {
      return res.status(404).json({ message: 'Poli tidak ditemukan' });
    }

    await db('antrian_poli')
      .where('POLI_ID', poliData.IDPOLI)
      .del();

    const broadcastUpdate = req.app.get('broadcastUpdate');
    if (broadcastUpdate) {
      broadcastUpdate();
    }

    return res.json({ message: `Antrian poli ${poli} berhasil direset.` });
  } catch (error) {
    console.error('Gagal reset antrian poli:', error);
    return res.status(500).json({ message: 'Gagal reset antrian poli' });
  }
};