const namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const namaBulan = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const formatTanggal = (tanggalString: string) => {
  if (!tanggalString) return '';
  const date = new Date(tanggalString);

  const hari = namaHari[date.getDay()];
  const tanggal = date.getDate();
  const bulan = namaBulan[date.getMonth()];
  const tahun = date.getFullYear();

  return `${hari}, ${tanggal} ${bulan} ${tahun}`;
};

export const formatJam = (jamString: unknown) => {
  if (!jamString) return '';

  if (typeof jamString === 'string') {
    return `${jamString.slice(0, 5)} WIB`;
  }

  // Jika Date object
  if (jamString instanceof Date) {
    const jam = jamString.getHours().toString().padStart(2, '0');
    const menit = jamString.getMinutes().toString().padStart(2, '0');
    return `${jam}:${menit} WIB`;
  }

  // Jika tipe lain
  return '';
};

