import * as PoliModel from '../models/poliModel.js';

export async function getAllPoli(req, res) {
    try {
        const poli = await PoliModel.getAll();
        res.json(poli);
    } catch (err) {
        console.error('Error backend:', err);
        res.status(500).json({ error: err.message });
    }
}

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

export async function createPoli(req, res) {
    try {
        const { NAMAPOLI, KODE } = req.body;

        await PoliModel.create({ NAMAPOLI, KODE });
        res.json({ message: 'Poli berhasil ditambahkan' });
    } catch (err) {
        console.error('Error backend:', err);
        res.status(500).json({ error: err.message });
    }
}

export async function updatePoli(req, res) {
    try {
        const id = req.params.id;
        const { NAMAPOLI, KODE } = req.body;

        await PoliModel.update(id, { NAMAPOLI, KODE });
        res.json({ message: 'Poli berhasil diperbarui' });
    } catch (err) {
        console.error('Error backend:', err);
        res.status(500).json({ error: err.message });
    }
}

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
