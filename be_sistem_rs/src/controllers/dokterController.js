// controllers/dokterController.js
import * as DokterModel from '../models/dokterModel.js';

// GET all dokter
export async function getAllDokter(req, res) {
    try {
        const dokters = await DokterModel.getAllDokter();
        res.json(dokters);
    } catch (err) {
        console.error('Error backend:', err);
        res.status(500).json({ error: err.message });
    }
}

// GET dokter by ID
export async function getDokterById(req, res) {
    try {
        const id = req.params.id;
        const dokter = await DokterModel.getDokterById(id);
        if (!dokter) return res.status(404).json({ error: 'Dokter tidak ditemukan' });
        res.json(dokter);
    } catch (err) {
        console.error('Error backend:', err);
        res.status(500).json({ error: err.message });
    }
}

// POST tambah dokter
export async function createDokter(req, res) {
    try {
        const { NAMADOKTER, SPESIALIS } = req.body;

        if (!NAMADOKTER) {
            return res.status(400).json({ error: 'Nama Dokter wajib diisi' });
        }

        await DokterModel.createDokter({ NAMADOKTER, SPESIALIS });
        res.json({ message: 'Dokter berhasil ditambahkan' });
    } catch (err) {
        console.error('Error backend:', err);
        res.status(500).json({ error: err.message });
    }
}

// PUT update dokter
export async function updateDokter(req, res) {
    try {
        const id = req.params.id;
        const { NAMADOKTER, SPESIALIS } = req.body;

        if (!NAMADOKTER) {
            return res.status(400).json({ error: 'Nama Dokter wajib diisi' });
        }

        await DokterModel.updateDokter(id, { NAMADOKTER, SPESIALIS });
        res.json({ message: 'Dokter berhasil diperbarui' });
    } catch (err) {
        console.error('Error backend:', err);
        res.status(500).json({ error: err.message });
    }
}

// DELETE hapus dokter
export async function deleteDokter(req, res) {
    try {
        const id = req.params.id;

        await DokterModel.deleteDokter(id);
        res.json({ message: 'Dokter berhasil dihapus' });
    } catch (err) {
        console.error('Error backend:', err);
        res.status(500).json({ error: err.message });
    }
}
