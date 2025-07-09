export const getHariFromTanggal = (tanggal: string | Date): string => {
  const hari: string[] = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jum'at",
    "Sabtu",
  ];

  const date = typeof tanggal === 'string' ? new Date(tanggal) : tanggal;
  return hari[date.getDay()];
};
