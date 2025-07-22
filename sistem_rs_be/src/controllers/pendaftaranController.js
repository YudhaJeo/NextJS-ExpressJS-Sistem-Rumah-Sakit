import * as PendaftaranModel from '../models/pendaftaranModel.js';
import * as PengobatanModel from '../models/riwayatpengobatanModel.js'; 
import db from '../core/config/knex.js';

export async function createPendaftaran(req, res) {
  const trx = await db.transaction(); // gunakan transaksi biar aman
  try {
    const { NIK, TANGGALKUNJUNGAN, IDPOLI, KELUHAN, STATUSKUNJUNGAN } = req.body;

    // 1. Simpan ke tabel pendaftaran
    const [idPendaftaran] = await trx('pendaftaran').insert({
      NIK,
      TANGGALKUNJUNGAN,
      IDPOLI,
      KELUHAN,
      STATUSKUNJUNGAN,
    }).returning('IDPENDAFTARAN');

    // 2. Cari dokter pertama (atau logika pemilihan dokter lainnya) berdasarkan IDPOLI
    const dokter = await trx('dokter')
      .where('IDPOLI', IDPOLI)
      .orderBy('IDDOKTER') // bisa sesuaikan dengan urutan antrian
      .first();

      if (!dokter) {
        console.warn('⚠️ Tidak ada dokter di poli ini. Riwayat pengobatan tidak dibuat otomatis.');
      } else {
        await PengobatanModel.createPengobatan({
          IDPENDAFTARAN: idPendaftaran,
          IDDOKTER: dokter.IDDOKTER,
          STATUSKUNJUNGAN,
          STATUSRAWAT: 'Rawat Jalan',
          DIAGNOSA: '',
          OBAT: '',
        }, trx);
      }

    // 3. Simpan entri awal riwayat pengobatan (diagnosa dan obat dikosongkan dulu)
    await PengobatanModel.createPengobatan({
      IDPENDAFTARAN: idPendaftaran,
      IDDOKTER: dokter.IDDOKTER,
      STATUSKUNJUNGAN,
      STATUSRAWAT: 'Rawat Jalan',
      DIAGNOSA: '',
      OBAT: '',
    }, trx); // pakai trx supaya dalam 1 transaksi

    await trx.commit();
    res.json({ message: 'Pendaftaran & riwayat awal berhasil dibuat' });

  } catch (err) {
    await trx.rollback();
    console.error('❌ Gagal buat pendaftaran & riwayat:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function getAllPendaftaran(req, res) {
  try {
    const data = await PendaftaranModel.getAll();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// export async function createPendaftaran(req, res) {
//   try {
//     const { NIK, TANGGALKUNJUNGAN, IDPOLI, KELUHAN, STATUSKUNJUNGAN } = req.body;
//     await PendaftaranModel.create({ NIK, TANGGALKUNJUNGAN, IDPOLI, KELUHAN, STATUSKUNJUNGAN });
//     res.json({ message: 'Pendaftaran berhasil ditambahkan' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// }

export async function updatePendaftaran(req, res) {
  try {
    const id = req.params.id;
    const { NIK, TANGGALKUNJUNGAN, IDPOLI, KELUHAN, STATUSKUNJUNGAN } = req.body;

    console.log('Update ID:', id);
    console.log('Update Data:', req.body); 

    const result = await PendaftaranModel.update(id, { NIK, TANGGALKUNJUNGAN, IDPOLI, KELUHAN, STATUSKUNJUNGAN });

    res.json({ message: 'Pendaftaran berhasil diperbarui' });
  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function deletePendaftaran(req, res) {
  try {
    const id = req.params.id;
    await PendaftaranModel.remove(id);
    res.json({ message: 'Pendaftaran berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}