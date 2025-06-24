export interface Pasien {
    IDPASIEN?: number;
    NIK: string;
    NAMALENGKAP: string;
    TANGGALLAHIR: string;
    JENISKELAMIN: 'L' | 'P';
    ALAMAT?: string;
    NOHP?: string;
    AGAMA?: string;
    GOLDARAH?: string;
    ASURANSI?: 'BPJS' | 'Umum' | 'Lainnya';
    NOASURANSI?: string;
    TANGGALDAFTAR?: string;
}