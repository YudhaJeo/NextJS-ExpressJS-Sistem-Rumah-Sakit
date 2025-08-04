import * as Tindakan from '../models/tindakanModel.js';

export async function getAllTindakan(req, res) {
    try {
        const data = await Tindakan.getAll();
        res.json({ data });
    } catch (err) {
        console.error('Gagal mengambil data tindakan: ', err);
        res.status(500).json({ error: err.message });
    }
}

export async function insertTindakan(req, res) {
    try {
        const { NAMATINDAKAN, HARGA, KATEGORI, DESKRIPSI } = req.body;
        await Tindakan.createTindakan({ NAMATINDAKAN, HARGA, KATEGORI, DESKRIPSI });
        res.json({ message: 'Jenis bangsal berhasil ditambahkan' });
    } catch (err) {
        console.error('Gagal insert data tindakan: ', err)
        res.status(500).json({ error: err.message })
    }
}

export async function updateTindakan(req, res) {
    try {
        const id = req.params.id;
        const { NAMATINDAKAN, HARGA, KATEGORI, DESKRIPSI } = req.body;
        const existing = await Tindakan.getById(id);

        if (!existing) {
            return res.status(404).json({ error: 'Data tindakan tidak ditemukan' });
        }

        await Tindakan.updateTindakan(id, { NAMATINDAKAN, HARGA, KATEGORI, DESKRIPSI });
        res.json({ message: 'Jenis tindakan berhasil diperbarui' });
    } catch (err) {
        res.status(500).json({ error: err.message })
    }

}

export async function deleteTindakan(req, res) {
    try {
        const id = req.params.id;

        const existing = await Tindakan.getById(id);
        if (!existing) {
            return res.status(404).json({ error: 'Data tidak ditemukan' });
        }

        await Tindakan.remove(id);
        res.json({ message: 'Data berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
