import db from '../core/config/knex.js';

export const getRawatInapDashboard = async (req, res) => {
  try {
    const TERSEDIA = await db('bed')
      .whereIn('STATUS', ['TERSEDIA', 'DIBERSIHKAN'])
      .count('IDBED as count')
      .first();

    const TERISI = await db('bed')
      .where({ STATUS: 'TERISI' })
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
        jumlah_kamar: Number(KAMAR.count),
        jumlah_bangsal: Number(BANGSAL.count),
      }
    });
  } catch (err) {
    console.error('Gagal ambil data dashboard:', err);
    res.status(500).json({ error: 'Gagal ambil data dashboard' });
  }
};
