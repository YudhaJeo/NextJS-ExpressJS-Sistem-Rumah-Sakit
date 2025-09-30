import * as Alkes from '../models/alkesModel.js';

export async function getAllAlkes(req, res) {
    try {
        const data = await Alkes.getAll();
        res.json({ data });
    } catch (err) {
        console.error('Gagal mengambil data alkes: ', err);
        res.status(500).json({ error: err.message });
    }
}

export async function getAlkesById(req, res) {
    try {
        const { id } = req.params;
        const alkes = await Alkes.getById(id);
        if (!alkes) return res.status(404).json({ error: 'Data alkes tidak ditemukan' });
        res.json(alkes);
    } catch (err) {
        console.error('Gagal mengambil data alkes: ', err);
        res.status(500).json({ error: err.message });
    }
}

export async function insertAlkes(req, res) {
    try {
        const {
            KODEALKES, NAMAALKES, MERKALKES, JENISALKES, STOK,
            HARGABELI, HARGAJUAL, TGLKADALUARSA,
            IDSUPPLIER, LOKASI, DESKRIPSI
        } = req.body;

        await Alkes.createAlkes({
            KODEALKES, NAMAALKES, MERKALKES, JENISALKES, STOK,
            HARGABELI, HARGAJUAL, TGLKADALUARSA,
            IDSUPPLIER, LOKASI, DESKRIPSI
        });

        res.json({ message: 'Data alkes berhasil ditambahkan' });
    } catch (err) {
        console.error('Gagal insert data alkes: ', err);
        res.status(500).json({ error: err.message });
    }
}

export async function updateAlkes(req, res) {
    try {
        const id = req.params.id;
        const {
            KODEALKES, NAMAALKES, MERKALKES, JENISALKES, STOK,
            HARGABELI, HARGAJUAL, TGLKADALUARSA,
            IDSUPPLIER, LOKASI, DESKRIPSI
        } = req.body;

        const existing = await Alkes.getById(id);
        if (!existing) return res.status(404).json({ error: 'Data alkes tidak ditemukan' });

        await Alkes.updateAlkes(id, {
            KODEALKES, NAMAALKES, MERKALKES, JENISALKES, STOK,
            HARGABELI, HARGAJUAL, TGLKADALUARSA,
            IDSUPPLIER, LOKASI, DESKRIPSI
        });

        res.json({ message: 'Data alkes berhasil diperbarui' });
    } catch (err) {
        console.error('Gagal update data alkes: ', err);
        res.status(500).json({ error: err.message });
    }
}

export async function deleteAlkes(req, res) {
    try {
        const id = req.params.id;
        const existing = await Alkes.getById(id);
        if (!existing) return res.status(404).json({ error: 'Data alkes tidak ditemukan' });

        await Alkes.remove(id);
        res.json({ message: 'Data alkes berhasil dihapus' });
    } catch (err) {
        console.error('Gagal hapus data alkes: ', err);
        res.status(500).json({ error: err.message });
    }
}