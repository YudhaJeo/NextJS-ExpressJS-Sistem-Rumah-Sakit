import * as ReservasiModel from '../models/reservasiModel.js';

export async function getAllReservasi(req, res) {
    try {
        const reservasi = await ReservasiModel.getAll();
        res.json({ data: reservasi });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function createReservasi(req, res) {
    try {
        const { TGLKONSUL, SLOT, PASIEN, POLI, DOKTER, STATUS } = req.body;
        await ReservasiModel.create({ TGLKONSUL, SLOT, PASIEN, POLI, DOKTER, STATUS });
        res.json({ message: 'Reservasi berhasil ditambahkan' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function updateReservasi(req, res) {
    console.log("Update data:", req.body);
    try {
        const id = req.params.id;
        const { TGLKONSUL, SLOT, PASIEN, POLI, DOKTER, STATUS } = req.body;
        await ReservasiModel.update(id, { TGLKONSUL, SLOT, PASIEN, POLI, DOKTER, STATUS });
        res.json({ message: 'Reservasi berhasil diperbarui' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function deleteReservasi(req, res) {
    try {
        const id = req.params.id;
        await ReservasiModel.remove(id);
        res.json({ message: 'Reservasi berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
