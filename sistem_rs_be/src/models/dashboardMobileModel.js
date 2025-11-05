import db from '../core/config/knex.js';

// === Hitung Total ===
export const getTotalBerita = async () => {
  try {
    return await db('berita').count('IDBERITA as total').first();
  } catch (error) {
    console.error('Error getTotalBerita:', error);
    throw error;
  }
};

export const getTotalKritikSaran = async () => {
  try {
    return await db('kritik_saran').count('IDKRITIKSARAN as total').first();
  } catch (error) {
    console.error('Error getTotalKritikSaran:', error);
    throw error;
  }
};

export const getTotalNotifikasi = async () => {
  try {
    return await db('notifikasi_user').count('IDNOTIFIKASI as total').first();
  } catch (error) {
    console.error('Error getTotalNotifikasi:', error);
    throw error;
  }
};

export const getTotalProfile = async () => {
  try {
    return await db('profile_mobile').count('IDPROFILE as total').first();
  } catch (error) {
    console.error('Error getTotalProfile:', error);
    throw error;
  }
};

// === Ambil Data Terbaru ===
export const getRecentData = async () => {
  try {
    const berita = await db('berita')
      .select('JUDUL as judul', 'CREATED_AT as tanggal')
      .orderBy('CREATED_AT', 'desc')
      .limit(3);

    const kritik = await db('kritik_saran')
      .select('PESAN as judul', 'CREATED_AT as tanggal')
      .orderBy('CREATED_AT', 'desc')
      .limit(3);

    const notifikasi = await db('notifikasi_user')
      .select('JUDUL as judul', 'CREATED_AT as tanggal')
      .orderBy('CREATED_AT', 'desc')
      .limit(3);

    // Gabungkan semua kategori
    const recent = [
      ...berita.map((b) => ({ kategori: 'Berita', ...b })),
      ...kritik.map((k) => ({ kategori: 'Kritik & Saran', ...k })),
      ...notifikasi.map((n) => ({ kategori: 'Notifikasi', ...n })),
    ].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    return recent;
  } catch (error) {
    console.error('Error getRecentData:', error);
    throw error;
  }
};
