// src/app.js
import express from 'express';
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
import userRoutes from './routes/userRoutes.js';
import jenisBangsalRoutes from './routes/jenisBangsalRoutes.js';
import antrianPoliRoutes from './routes/antrianPoliRoutes.js';
import datadokterRoutes from './routes/datadokterRoutes.js';
import bangsalRoutes from './routes/bangsalRoutes.js';
import jadwalpraktekRoutes from './routes/jadwalpraktekRoutes.js';
import pembayaranRoutes from './routes/pembayaranRoutes.js';
import kamarRoutes from './routes/kamarRoutes.js';
import bankAccountRoutes from './routes/bankAccountRoutes.js';
import metodePembayaranRoutes from './routes/metodePembayaranRoutes.js';
import bedRoutes from './routes/bedRoutes.js';
import jadwaldokterRoutes from './routes/jadwaldokterRoutes.js';


const app = express();

app.use(cors({ 
    origin: "http://localhost:3000", 
    credentials: true 
}));
app.use(express.json());

app.use('/uploads', express.static('uploads'));

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
app.use('/api/poli', poliRoutes)
app.use('/api/dokter', dokterRoutes)
app.use('/api/jenisbangsal', jenisBangsalRoutes);
app.use('/api/profile', userRoutes);
app.use('/api/poli', poliRoutes);
app.use('/api/dokter', dokterRoutes);
app.use('/api', dashboardPasienRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/bangsal', bangsalRoutes);
app.use('/api/antrianpoli', antrianPoliRoutes);
app.use('/api/datadokter', datadokterRoutes);
app.use('/api/jadwalpraktek', jadwalpraktekRoutes);
app.use('/api/pembayaran', pembayaranRoutes);
app.use('/api/kamar', kamarRoutes);
app.use('/api/bankaccount', bankAccountRoutes);
app.use('/api/metodepembayaran', metodePembayaranRoutes);
app.use('/api/bed', bedRoutes);
app.use('/api/jadwaldokter', jadwaldokterRoutes);

export default app;