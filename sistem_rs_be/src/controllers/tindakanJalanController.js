import * as TindakanJalan from "../models/tindakanJalanModel.js";
import * as Tindakan from "../models/tindakanModel.js";

export async function getByRawatJalanId(req, res) {
  try {
    const { id } = req.params;
    const data = await TindakanJalan.getAllByRawatJalan(id);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function insertTindakanJalan(req, res) {
  try {
    const { id } = req.params; 
    const { IDTINDAKAN, JUMLAH } = req.body;

    const tindakan = await Tindakan.getById(IDTINDAKAN);
    if (!tindakan) return res.status(404).json({ error: "Tindakan tidak ditemukan" });

    const HARGA = tindakan.HARGA;
    const TOTAL = HARGA * JUMLAH;

    await TindakanJalan.create({
      IDRAWATJALAN: id,
      IDTINDAKAN,
      JUMLAH,
      HARGA,
      TOTAL
    });

    res.json({ message: "Tindakan berhasil ditambahkan" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateTindakanJalan(req, res) {
  try {
    const { tindakanId } = req.params;
    const { IDTINDAKAN, JUMLAH } = req.body;

    const tindakan = await Tindakan.getById(IDTINDAKAN);
    if (!tindakan) return res.status(404).json({ error: "Tindakan tidak ditemukan" });

    const HARGA = tindakan.HARGA;
    const TOTAL = HARGA * JUMLAH;

    await TindakanJalan.update(tindakanId, {
      IDTINDAKAN,
      JUMLAH,
      HARGA,
      TOTAL
    });

    res.json({ message: "Tindakan berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteTindakanJalan(req, res) {
  try {
    const { tindakanId } = req.params;
    await TindakanJalan.remove(tindakanId);
    res.json({ message: "Tindakan berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}