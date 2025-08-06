import * as kartustokModel from '../models/kartustokModel.js';

export async function getAll(req, res) {
    try {
        const kartu = await kartustokModel.getAll();
        res.json(kartu);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: err.message });
    }
}

export async function getById(req, res) {
    try {
        const id = req.params.id;
        const kartu = await kartustokModel.getById(id);
        if (!kartu) return res.status(404).json({ error: 'kartu tidak ditemukan' });
        res.json(kartu);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: err.message });
    }
}

export async function create(req, res) {
    try {
        const { IDOBAT, IDALKES,  TANGGAL, JENISTRANSAKSI, JUMLAHOBAT, JUMLAHALKES, SISASTOK, KETERANGAN } = req.body;
        if (!IDOBAT) return res.status(400).json({ error: 'Kartu wajib diisi' });

        const data = await kartustokModel.create({ IDOBAT, IDALKES, TANGGAL, JENISTRANSAKSI, JUMLAHOBAT, JUMLAHALKES, SISASTOK, KETERANGAN });

        console.log("DATA", data)
        res.json({ message: 'Kartu berhasil ditambahkan' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: err.message });
    }
}

export async function update(req, res) {
    try {
        const id = req.params.id;
        const { IDOBAT, IDALKES, TANGGAL, JENISTRANSAKSI, JUMLAHOBAT, JUMLAHALKES, SISASTOK, KETERANGAN } = req.body;
        if (!IDOBAT) return res.status(400).json({ error: 'Nama Kartu wajib diisi' });

        await kartustokModel.update(id, { IDOBAT, IDALKES, TANGGAL, JENISTRANSAKSI, JUMLAHOBAT, JUMLAHALKES, SISASTOK, KETERANGAN });
        res.json({ message: 'Kartu berhasil diperbarui' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: err.message });
    }
}

export async function remove(req, res) {
    try {
        const id = req.params.id;
        await kartustokModel.remove(id);
        res.json({ message: 'Kartu berhasil dihapus' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: err.message });
    }
}
