import * as SupplierModel from '../models/supplierModel.js';

export async function getAllSupplier(req, res) {
    try {
        const supplier = await SupplierModel.getAll();
        res.json(supplier);
    } catch (err) {
        console.error('Error backend:', err);
        res.status(500).json({ error: err.message });
    }
}

export async function getSupplierById(req, res) {
    try {
        const id = req.params.id;
        const supplier = await SupplierModel.getById(id);
        if (!supplier) return res.status(404).json({ error: 'supplier tidak ditemukan' });
        res.json(supplier);
    } catch (err) {
        console.error('Error backend:', err);
        res.status(500).json({ error: err.message });
    }
}

export async function createSupplier(req, res) {
    try {
        const { NAMASUPPLIER, ALAMAT, KOTA, TELEPON, EMAIL, NAMASALES } = req.body;

        await SupplierModel.create({ NAMASUPPLIER, ALAMAT, KOTA, TELEPON, EMAIL, NAMASALES });
        res.json({ message: 'Supplier berhasil ditambahkan' });
    } catch (err) {
        console.error('Error backend:', err);
        res.status(500).json({ error: err.message });
    }
}

export async function updateSupplier(req, res) {
    try {
        const id = req.params.id;
        const { NAMASUPPLIER, ALAMAT, KOTA, TELEPON, EMAIL, NAMASALES } = req.body;

        await SupplierModel.update(id, { NAMASUPPLIER, ALAMAT, KOTA, TELEPON, EMAIL, NAMASALES });
        res.json({ message: 'Supllier berhasil diperbarui' });
    } catch (err) {
        console.error('Error backend:', err);
        res.status(500).json({ error: err.message });
    }
}

export async function deleteSupplier(req, res) {
    try {
        const id = req.params.id;

        await SupplierModel.remove(id);
        res.json({ message: 'Supplier berhasil dihapus' });
    } catch (err) {
        console.error('Error backend:', err);
        res.status(500).json({ error: err.message });
    }
}