import * as RawatJalanModel from '../models/rawatJalanModel.js';
import * as RiwayatRawatJalan from '../models/riwayatJalanModel.js';
import * as RawatInapModel from '../models/rawatInapModel.js';
import db from '../core/config/knex.js';

export async function getAllRawatJalan(req, res) {
  try {
    const poli = req.query.poli;
    let data = await RawatJalanModel.getAllRawatJalan();

    if (poli) {
      data = data.filter((item) => item.POLI === poli);
    }

    res.json({ data });
  } catch (err) {
    console.error('🔥 ERROR GET /rawat_jalan:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function createRawatJalan(req, res) {
  try {
    const { IDPENDAFTARAN, IDDOKTER, STATUSKUNJUNGAN, STATUSRAWAT, DIAGNOSA, KETERANGAN } = req.body;
    const FOTORESEP = req.file ? req.file.filename : null;
    await RawatJalanModel.createRawatJalan({
      IDPENDAFTARAN,
      IDDOKTER,
      STATUSKUNJUNGAN,
      STATUSRAWAT,
      DIAGNOSA,
      KETERANGAN,
      FOTORESEP
    });
    res.json({ message: 'RawatJalan berhasil ditambahkan' });
  } catch (err) {
    console.error('Insert Error:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function updateRawatJalan(req, res) {
  const id = req.params.id;

  try {
    const { IDDOKTER, STATUSKUNJUNGAN, STATUSRAWAT, DIAGNOSA, KETERANGAN } = req.body;
    const FOTORESEP = req.file ? req.file.filename : null;

    await RawatJalanModel.updateRawatJalan(id, {
      IDDOKTER,
      STATUSKUNJUNGAN,
      STATUSRAWAT,
      DIAGNOSA,
      KETERANGAN,
      FOTORESEP
    });

    const updated = await RawatJalanModel.getRawatById(id);

    if (STATUSRAWAT === "Rawat Inap") {
      const existingInap = await db('rawat_inap')
        .where('IDRAWATJALAN', updated.IDRAWATJALAN)
        .first();

      if (!existingInap) {
        const bedTersedia = await db('bed').where('STATUS', 'TERSEDIA').first();
        if (!bedTersedia) {
          return res.status(400).json({ message: "Tidak ada bed tersedia" });
        }

        await RawatInapModel.create({
          IDRAWATJALAN: updated.IDRAWATJALAN,
          IDBED: bedTersedia.IDBED,
          TANGGALMASUK: new Date(),
          CATATAN: 'Otomatis dari Rawat Jalan'
        });
      }
    }

    if (STATUSKUNJUNGAN === "Selesai") {
      const obat = await RawatJalanModel.getTotalObatInap(updated.IDRAWATJALAN);
      const tindakan = await RawatJalanModel.getTotalTindakanInap(updated.IDRAWATJALAN);
      const TOTALOBAT = Number(obat.total) || 0;
      const TOTALTINDAKAN = Number(tindakan.total) || 0;
      const TOTALBIAYA = TOTALOBAT + TOTALTINDAKAN;

      const dataRiwayat = {
        IDRAWATJALAN: updated.IDRAWATJALAN,
        IDDOKTER: updated.IDDOKTER,
        DIAGNOSA: updated.DIAGNOSA,
        KETERANGAN: updated.KETERANGAN,
        FOTORESEP: updated.FOTORESEP,
        TOTALOBAT,
        TOTALTINDAKAN,
        TOTALBIAYA,
      };
      await RiwayatRawatJalan.insertFromRawatJalan(dataRiwayat);
    }

    res.json({ message: 'RawatJalan berhasil diperbarui & sinkron dengan Rawat Inap' });
  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function deleteRawatJalan(req, res) {
  try {
    const id = req.params.id;
    await RawatJalanModel.deleteRawatJalan(id);
    res.json({ message: 'RawatJalan berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const getMonitoringRawatJalan = async (req, res) => {
  try {
    const data = await RawatJalanModel.getAllRawatJalan();
    res.json(data);
  } catch (error) {
    console.error('Error getMonitoringRawatJalan:', error);
    res.status(500).json({ message: 'Gagal mengambil data rawat jalan' });
  }
}