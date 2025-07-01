//reservasiCOntroller
import * as ReservasiModel from '../models/reservasiModel.js';

export async function getAllReservasi(req, res) {
    try {
        const reservasi = await ReservasiModel.getAll();
        res.json(reservasi);
    } catch (err) {
        console.error('Error backend:', err);
        res.status(500).json({ error: err.message });
    }
}

export async function createReservasi(req, res) {
    try {
        const { NIK, IDPOLI, IDDOKTER, TANGGALRESERVASI, JAMRESERVASI, STATUS, KETERANGAN } = req.body;

        if (!NIK || !IDPOLI || !IDDOKTER || !TANGGALRESERVASI || !JAMRESERVASI || !STATUS) {
            return res.status(400).json({ error: 'Semua field wajib diisi' });
        }

        await ReservasiModel.create({ NIK, IDPOLI, IDDOKTER, TANGGALRESERVASI, JAMRESERVASI, STATUS, KETERANGAN });
        res.json({ message: 'Reservasi berhasil ditambahkan' });
    } catch (err) {
        console.error('Error backend:', err);
        res.status(500).json({ error: err.message });
    }
}

export async function updateReservasi(req, res) {
    try {
        const id = req.params.id;
        const { NIK, IDPOLI, IDDOKTER, TANGGALRESERVASI, JAMRESERVASI, STATUS, KETERANGAN } = req.body;

        await ReservasiModel.update(id, { NIK, IDPOLI, IDDOKTER, TANGGALRESERVASI, JAMRESERVASI, STATUS, KETERANGAN });
        res.json({ message: 'Reservasi berhasil diperbarui' });
    } catch (err) {
        console.error('Error backend:', err);
        res.status(500).json({ error: err.message });
    }
}

export async function deleteReservasi(req, res) {
    try {
        const id = req.params.id;
        await ReservasiModel.remove(id);
        res.json({ message: 'Reservasi berhasil dihapus' });
    } catch (err) {
        console.error('Error backend:', err);
        res.status(500).json({ error: err.message });
    }
}
