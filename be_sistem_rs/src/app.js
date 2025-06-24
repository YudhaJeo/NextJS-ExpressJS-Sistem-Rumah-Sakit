// src/app.js
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import pasienRoutes from './routes/pasienRoutes.js';
import reservasiRoutes from './routes/reservasiRoutes.js';
import dokumenRoutes from './routes/dokumenRoutes.js';
const app = express();

app.use(cors({ 
    origin: "http://localhost:3000", 
    credentials: true 
}));
app.use(express.json());

app.use('/', authRoutes); 
app.use('/api/pasien', pasienRoutes);
app.use('/api/reservasi', reservasiRoutes);
app.use('/api/dokumen', dokumenRoutes);
export default app;