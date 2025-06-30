// src/app.js
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import pasienRoutes from './routes/pasienRoutes.js';
import reservasiRoutes from './routes/reservasiRoutes.js';
import pendaftaranRoutes from './routes/pendaftaranRoutes.js';
import dokumenRoutes from './routes/dokumenRoutes.js';
import asuransiRoutes from './routes/asuransiRoutes.js';
import loketRoutes from './routes/loketRoutes.js';
import printerRoutes from './routes/printerRoutes.js';
import { verifyToken } from './middlewares/jwt.js'
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
app.use('/api/asuransi', asuransiRoutes);
app.use('/api/loket', loketRoutes);
app.use('/api/printer', printerRoutes);

export default app;