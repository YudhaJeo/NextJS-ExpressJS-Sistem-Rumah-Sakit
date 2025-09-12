import db from '../core/config/knex.js';

export const getRuanganDashboard = async (req, res) => {
  try {
    const TERSEDIA = await db('bed')
      .whereIn('STATUS', ['TERSEDIA', 'DIBERSIHKAN'])
      .count('IDBED as count')
      .first();

    const TERISI = await db('bed')
      .where({ STATUS: 'TERISI' })
      .count('IDBED as count')
      .first();

    const NAMAJENIS = await db('jenis_bangsal')
      .count('IDJENISBANGSAL as count')
      .first();

    const BED = await db('bed')
      .count('IDBED as count')
      .first();

    const KAMAR = await db('kamar')
      .count('IDKAMAR as count')
      .first();

    const BANGSAL = await db('bangsal')
      .count('IDBANGSAL as count')
      .first();

    res.json({
      data: {
        tersedia: Number(TERSEDIA.count),
        terisi: Number(TERISI.count),
        jumlah_jenis: Number(NAMAJENIS.count),
        jumlah_bangsal: Number(BANGSAL.count),
        jumlah_kamar: Number(KAMAR.count),
        jumlah_bed: Number(BED.count),
      }
    });
  } catch (err) {
    console.error('Gagal ambil data dashboard:', err);
    res.status(500).json({ error: 'Gagal ambil data dashboard' });
  }
};
export const getRawatInapDashboard = async (req, res) => {
  try {
    const AKTIF = await db('rawat_inap')
      .whereIn('STATUS', ['AKTIF'])
      .count('IDRAWATINAP as count')
      .first();

    const SELESAI = await db('rawat_inap')
      .where({ STATUS: 'SELESAI' })
      .count('IDRAWATINAP as count')
      .first();

    const TAGIHAN = await db('rawat_inap')
      .whereIn('STATUS', ['AKTIF'])
      .count('IDRAWATINAP as count')
      .first();

    const LAPORANRIWAYAT = await db('rawat_inap')
      .where({ STATUS: 'SELESAI' })
      .count('IDRAWATINAP as count')
      .first();

    res.json({
      data: {
        aktif: Number(AKTIF.count),
        selesai: Number(SELESAI.count),
        tagihan: Number(TAGIHAN.count),
        laporan: Number(LAPORANRIWAYAT.count),
      }
    });
  } catch (err) {
    console.error('Gagal ambil data dashboard:', err);
    res.status(500).json({ error: 'Gagal ambil data dashboard' });
  }
};
