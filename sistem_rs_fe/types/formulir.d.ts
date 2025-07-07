export interface Pendaftaran {
  IDPENDAFTARAN?: number; 
  NAMALENGKAP: string;
  NIK: string;
  TANGGALKUNJUNGAN: string; 
  LAYANAN: 'Rawat Jalan' | 'Rawat Inap' | 'IGD';
  POLI: string;
  NAMADOKTER: string;
  STATUSKUNJUNGAN: 'Diperiksa' | 'Batal' | 'Selesai';
}
