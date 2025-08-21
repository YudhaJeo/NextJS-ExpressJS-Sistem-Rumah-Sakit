import * as Obat from '../models/obatModel.js';

export async function getAllObat(req, res) {
    try {
        const data = await Obat.getAll();
        res.json({ data });
    } catch (err) {
        console.error('Gagal mengambil data obat: ', err);
        res.status(500).json({ error: err.message });
    }
}

export async function getObatById(req, res) {
    try {
        const { id } = req.params;
        const obat = await Obat.getById(id);
        if (!obat) return res.status(404).json({ error: 'Data obat tidak ditemukan' });
        res.json(obat);
    } catch (err) {
        console.error('Gagal mengambil data obat: ', err);
        res.status(500).json({ error: err.message });
    }
}

export async function insertObat(req, res) {
    try {
        const {
            KODEOBAT, NAMAOBAT, MERKOBAT, JENISOBAT, STOK,
            HARGABELI, HARGAJUAL, TGLKADALUARSA,
            SUPPLIERID, LOKASI, DESKRIPSI
        } = req.body;

        await Obat.createObat({
            KODEOBAT, NAMAOBAT, MERKOBAT, JENISOBAT, STOK,
            HARGABELI, HARGAJUAL, TGLKADALUARSA,
            SUPPLIERID, LOKASI, DESKRIPSI
        });

        res.json({ message: 'Data obat berhasil ditambahkan' });
    } catch (err) {
        console.error('Gagal insert data obat: ', err);
        res.status(500).json({ error: err.message });
    }
}

export async function updateObat(req, res) {
    try {
        const id = req.params.id;
        const {
            KODEOBAT, NAMAOBAT, MERKOBAT, JENISOBAT, STOK,
            HARGABELI, HARGAJUAL, TGLKADALUARSA,
            SUPPLIERID, LOKASI, DESKRIPSI
        } = req.body;

        const existing = await Obat.getById(id);
        if (!existing) return res.status(404).json({ error: 'Data obat tidak ditemukan' });

        await Obat.updateObat(id, {
            KODEOBAT, NAMAOBAT, MERKOBAT, JENISOBAT, STOK,
            HARGABELI, HARGAJUAL, TGLKADALUARSA,
            SUPPLIERID, LOKASI, DESKRIPSI
        });

        res.json({ message: 'Data obat berhasil diperbarui' });
    } catch (err) {
        console.error('Gagal update data obat: ', err);
        res.status(500).json({ error: err.message });
    }
}

export async function deleteObat(req, res) {
    try {
        const id = req.params.id;
        const existing = await Obat.getById(id);
        if (!existing) return res.status(404).json({ error: 'Data obat tidak ditemukan' });

        await Obat.remove(id);
        res.json({ message: 'Data obat berhasil dihapus' });
    } catch (err) {
        console.error('Gagal hapus data obat: ', err);
        res.status(500).json({ error: err.message });
    }
}