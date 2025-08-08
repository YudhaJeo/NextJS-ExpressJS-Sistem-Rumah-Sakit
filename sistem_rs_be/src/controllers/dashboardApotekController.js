import * as Obat from '../models/obatModel.js';
import * as Alkes from '../models/alkesModel.js';
import * as Supplier from '../models/supplierModel.js';
import * as Pemesanan from '../models/pemesananModel.js';

export async function index(req, res) {
  try {
    const totalObat = (await Obat.getAll()).length;
    const totalAlkes = (await Alkes.getAll()).length;
    const totalSupplier = (await Supplier.getAll()).length;
    const totalPemesanan = (await Pemesanan.getAllPemesanan()).length;

    res.json({
      totalObat,
      totalAlkes,
      totalSupplier,
      totalPemesanan
    });
  } catch (err) {
    console.error('Gagal ambil data statistik apotek:', err);
    res.status(500).json({ error: err.message });
  }
}