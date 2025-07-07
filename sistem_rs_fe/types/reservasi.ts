//reservasi.ts
export interface Reservasi {
    IDRESERVASI?: number;
    NIK: string;
    POLI: string;
    NAMADOKTER: string;
    TANGGALRESERVASI: string;
    JAMRESERVASI: string;
    STATUS: 'Menunggu' | 'Dikonfirmasi' | 'Dibatalkan';
    KETERANGAN: string;
}
