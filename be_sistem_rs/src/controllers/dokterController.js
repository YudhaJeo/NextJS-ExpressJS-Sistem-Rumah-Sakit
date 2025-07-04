import * as DokterModel from '../models/dokterModel.js';

export async function getAllDokter(req, res) {
    try {
        const dokters = await DokterModel.getAllDokter();
        res.json(dokters);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: err.message });
    }
}

export async function getDokterById(req, res) {
    try {
        const id = req.params.id;
        const dokter = await DokterModel.getDokterById(id);
        if (!dokter) return res.status(404).json({ error: 'Dokter tidak ditemukan' });
        res.json(dokter);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: err.message });
    }
}

export async function createDokter(req, res) {
    try {
        const { NAMADOKTER, IDPOLI, JADWAL } = req.body;
        if (!NAMADOKTER) return res.status(400).json({ error: 'Nama Dokter wajib diisi' });

        await DokterModel.createDokter({ NAMADOKTER, IDPOLI, JADWAL });
        res.json({ message: 'Dokter berhasil ditambahkan' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: err.message });
    }
}

export async function updateDokter(req, res) {
    try {
        const id = req.params.id;
        const { NAMADOKTER, IDPOLI, JADWAL } = req.body;
        if (!NAMADOKTER) return res.status(400).json({ error: 'Nama Dokter wajib diisi' });

        await DokterModel.updateDokter(id, { NAMADOKTER, IDPOLI, JADWAL });
        res.json({ message: 'Dokter berhasil diperbarui' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: err.message });
    }
}

export async function deleteDokter(req, res) {
    try {
        const id = req.params.id;
        await DokterModel.deleteDokter(id);
        res.json({ message: 'Dokter berhasil dihapus' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: err.message });
    }
}
