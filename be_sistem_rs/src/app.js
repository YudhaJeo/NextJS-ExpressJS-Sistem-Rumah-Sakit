// src/app.js
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import pasienRoutes from './routes/pasienRoutes.js';
import pendaftaranRoutes from './routes/pendaftaranRoutes.js';

const app = express();

app.use(cors({ 
    origin: "http://localhost:3000", 
    credentials: true 
}));
app.use(express.json());

app.use('/', authRoutes); 
app.use('/api/pasien', pasienRoutes);
app.use('/api/pendaftaran', pendaftaranRoutes);

export default app;
