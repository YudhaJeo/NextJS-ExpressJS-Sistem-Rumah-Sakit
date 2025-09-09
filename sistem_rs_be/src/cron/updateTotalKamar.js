import cron from 'node-cron';
import * as RawatInap from '../models/rawatInapModel.js';

cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Mulai update Total Kamar harian...');

    const rawatInaps = await RawatInap.getAllAktif(); 

    const today = new Date();

    for (const rawat of rawatInaps) {
      const tanggalMasuk = new Date(rawat.TANGGALMASUK);
      const durasi = Math.max(1, Math.ceil((today - tanggalMasuk) / (1000 * 60 * 60 * 24)));
      const totalKamar = (rawat.HARGAPERHARI || 0) * durasi;

      await RawatInap.updateTotalKamar(rawat.IDRAWATINAP, totalKamar);
    }

    console.log('Update Total Kamar harian Selesai.');
  } catch (err) {
    console.error('Error update TOTALKAMAR harian:', err);
  }
});
