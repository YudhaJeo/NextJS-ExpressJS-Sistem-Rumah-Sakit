//controller
// controllers/poliController.js
import * as PoliModel from '../models/poliModel.js';

// GET all poli
export async function getAllPoli(req, res) {
    try {
        const poli = await PoliModel.getAll();
        res.json(poli);
    } catch (err) {
        console.error('Error backend:', err);
        res.status(500).json({ error: err.message });
    }
}

// GET poli by ID
export async function getPoliById(req, res) {
    try {
        const id = req.params.id;
        const poli = await PoliModel.getById(id);
        if (!poli) return res.status(404).json({ error: 'Poli tidak ditemukan' });
        res.json(poli);
    } catch (err) {
        console.error('Error backend:', err);
        res.status(500).json({ error: err.message });
    }
}

// POST tambah poli
export async function createPoli(req, res) {
    try {
        const { NAMAPOLI } = req.body;

        if (!NAMAPOLI) {
            return res.status(400).json({ error: 'Nama Poli wajib diisi' });
        }

        await PoliModel.create({ NAMAPOLI });
        res.json({ message: 'Poli berhasil ditambahkan' });
    } catch (err) {
        console.error('Error backend:', err);
        res.status(500).json({ error: err.message });
    }
}

// PUT update poli
export async function updatePoli(req, res) {
    try {
        const id = req.params.id;
        const { NAMAPOLI } = req.body;

        if (!NAMAPOLI) {
            return res.status(400).json({ error: 'Nama Poli wajib diisi' });
        }

        await PoliModel.update(id, { NAMAPOLI });
        res.json({ message: 'Poli berhasil diperbarui' });
    } catch (err) {
        console.error('Error backend:', err);
        res.status(500).json({ error: err.message });
    }
}

// DELETE hapus poli
export async function deletePoli(req, res) {
    try {
        const id = req.params.id;

        await PoliModel.remove(id);
        res.json({ message: 'Poli berhasil dihapus' });
    } catch (err) {
        console.error('Error backend:', err);
        res.status(500).json({ error: err.message });
    }
}
