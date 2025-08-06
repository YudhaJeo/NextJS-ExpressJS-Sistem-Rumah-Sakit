import express from 'express';
import path from 'path';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import pasienRoutes from './routes/pasienRoutes.js';
import reservasiRoutes from './routes/reservasiRoutes.js';
import pendaftaranRoutes from './routes/pendaftaranRoutes.js';
import dokumenRoutes from './routes/dokumenRoutes.js';
import asuransiRoutes from './routes/asuransiRoutes.js';
import agamaRoutes from './routes/agamaRoutes.js';
import loketRoutes from './routes/loketRoutes.js';
import antrianRoutes from './routes/antrianRoutes.js';
import printerRoutes from './routes/printerRoutes.js';
import poliRoutes from './routes/poliRoutes.js';
import dokterRoutes from './routes/dokterRoutes.js';
import dashboardPasienRoutes from './routes/dashboardPasienRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import jenisBangsalRoutes from './routes/jenisBangsalRoutes.js';
import antrianPoliRoutes from './routes/antrianPoliRoutes.js';
import bangsalRoutes from './routes/bangsalRoutes.js';
import pembayaranRoutes from './routes/pembayaranRoutes.js';
import kamarRoutes from './routes/kamarRoutes.js';
import bankAccountRoutes from './routes/bankAccountRoutes.js';
import metodePembayaranRoutes from './routes/metodePembayaranRoutes.js';
import bedRoutes from './routes/bedRoutes.js';
import dashboardRawatInapRoutes from './routes/dashboardRawatInapRoutes.js';
import jadwaldokterRoutes from './routes/jadwaldokterRoutes.js';
import dashboardDokterRoutes from './routes/dashboardDokterRoutes.js';
import obatRoutes from './routes/obatRoutes.js';
import riwayatpengobatanRoutes from './routes/riwayatpengobatanRoutes.js';
import kalenderRoutes from './routes/kalenderRoutes.js';
import riwayatKunjunganRoutes from './routes/riwayatKunjunganRoutes.js';
import komisidokterRoutes from './routes/komisidokterRoutes.js'
import tindakanRoutes from './routes/tindakanRoutes.js';
import tenagaMedisRoutes from './routes/tenagaMedisRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import rawatInapRoutes from './routes/rawatInapRoutes.js';
import tenagaNonMedisRoutes from './routes/tenagaNonMedisRoutes.js';
import depositRoutes from './routes/depositRoutes.js';
import depositPenggunaanRoutes from './routes/depositPenggunaanRoutes.js';
import obatInapRoutes from './routes/obatInapRoutes.js';
import tindakanInapRoutes from './routes/tindakanInapRoutes.js';
import tagihanSementaraRoutes from './routes/tagihanSementaraRoutes.js';
import riwayatInapRoutes from './routes/riwayatInapRoutes.js';
import dashboardKasirRoutes from './routes/dashboardKasirRoutes.js';
import angsuranRoutes from './routes/angsuranRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import alkesRoutes from './routes/alkesRoutes.js';
import kartuRoutes from './routes/kartustokRoutes.js';
import pemesananRoutes from './routes/pemesananRoutes.js';

const NEXT_URL = process.env.NEXT_PUBLIC_URL;

const app = express();

app.use(cors({ 
    origin: `${NEXT_URL}`, 
    credentials: true 
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/', authRoutes); 
app.use('/api/pasien', pasienRoutes);
app.use('/api/reservasi', reservasiRoutes);
app.use('/api/dokumen', dokumenRoutes);
app.use('/api/pendaftaran', pendaftaranRoutes);
app.use('/api/asuransi', asuransiRoutes)
app.use('/api/agama', agamaRoutes);
app.use('/api/loket', loketRoutes);
app.use('/api/antrian', antrianRoutes);
app.use('/api/printer', printerRoutes);
app.use('/api/poli', poliRoutes);
app.use('/api/dokter', dokterRoutes);
app.use('/api/jenis_bangsal', jenisBangsalRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/poli', poliRoutes);
app.use('/api', dashboardPasienRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/bangsal', bangsalRoutes);
app.use('/api/antrian_poli', antrianPoliRoutes);
app.use('/api/pembayaran', pembayaranRoutes);
app.use('/api/kamar', kamarRoutes);
app.use('/api/bank_account', bankAccountRoutes);
app.use('/api/metode_pembayaran', metodePembayaranRoutes);
app.use('/api/bed', bedRoutes);
app.use('/api/dashboard_rawat_inap', dashboardRawatInapRoutes)
app.use('/api/jadwal_dokter', jadwaldokterRoutes);
app.use('/api/dashboard_dokter', dashboardDokterRoutes);
app.use('/api/obat', obatRoutes);
app.use('/api/riwayat_pengobatan', riwayatpengobatanRoutes);
app.use('/api/kalender', kalenderRoutes);
app.use('/api/tindakan_medis', tindakanRoutes);
app.use('/api/riwayat_kunjungan', riwayatKunjunganRoutes);
app.use('/api/komisi_dokter', komisidokterRoutes);
app.use('/api/tenaga_medis', tenagaMedisRoutes);
app.use('/api/rawat_inap', rawatInapRoutes);
app.use('/api/tenaga_non_medis', tenagaNonMedisRoutes);
app.use('/api/role', roleRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/deposit', depositRoutes);
app.use('/api/deposit_penggunaan', depositPenggunaanRoutes);
app.use('/api/obat_inap', obatInapRoutes);
app.use('/api/tindakan_inap', tindakanInapRoutes);
app.use('/api/tagihan_sementara', tagihanSementaraRoutes);
app.use('/api/riwayat_inap', riwayatInapRoutes);
app.use('/api/dashboard_kasir', dashboardKasirRoutes);
app.use('/api/angsuran', angsuranRoutes);
app.use('/api/supplier', supplierRoutes);
app.use('/api/alkes', alkesRoutes);
app.use('/api/kartu_stok', kartuRoutes);
app.use('/api/pemesanan', pemesananRoutes);

export default app;