import cron from 'node-cron';
import * as RawatInap from '../models/rawatInapModel.js';

//  tiap jam 00:00
cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Mulai update TOTALKAMAR harian...');

    const rawatInaps = await RawatInap.getAllAktif(); 

    const today = new Date();

    for (const rawat of rawatInaps) {
      const tanggalMasuk = new Date(rawat.TANGGALMASUK);
      const durasi = Math.max(1, Math.ceil((today - tanggalMasuk) / (1000 * 60 * 60 * 24)));
      const totalKamar = (rawat.HARGAPERHARI || 0) * durasi;

      await RawatInap.updateTotalKamar(rawat.IDRAWATINAP, totalKamar);
    }

    console.log('Update TOTALKAMAR harian selesai.');
  } catch (err) {
    console.error('Error update TOTALKAMAR harian:', err);
  }
});
