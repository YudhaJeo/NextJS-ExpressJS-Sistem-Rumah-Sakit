// sistem_rs_be\src\controllers\riwayatInapController.js
import * as RiwayatRawatInap from '../models/riwayatInapModel.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export async function getAllRiwayatInap(req, res) {
  try {
    const data = await RiwayatRawatInap.getAllRiwayatInap();
    res.status(200).json({ data });
  } catch (error) {
    console.error('[GET] /riwayat_inap gagal:', error);
    res.status(500).json({
      message: 'Gagal mengambil data riwayat rawat inap',
    });
  }
}

export async function getRiwayatInapById(req, res) {
  const { id } = req.params;

  if (isNaN(parseInt(id))) {
    return res.status(400).json({ message: 'ID tidak valid' });
  }

  try {
    const dataUtama = await RiwayatRawatInap.getRiwayatInapById(id);
    if (!dataUtama) {
      return res.status(404).json({ message: 'Riwayat rawat inap tidak ditemukan' });
    }

    const daftarObat = await RiwayatRawatInap.getRiwayatObatByIdRiwayat(id);
    const daftarTindakan = await RiwayatRawatInap.getRiwayatTindakanByIdRiwayat(id);

    const responseData = {
      ...dataUtama,
      obat: daftarObat,
      tindakan: daftarTindakan,
    };

    // console.log(`[GET] /riwayat_inap/${id} response:\n`, JSON.stringify(responseData, null, 2));
    
    return res.status(200).json({ data: responseData });
  } catch (err) {
    console.error(`[GET] /riwayat_inap/${id} gagal:`, err);
    return res.status(500).json({ message: 'Gagal mengambil detail riwayat rawat inap' });
  }
}

export async function generateRiwayatInapPDF(req, res) {
  const { id } = req.params;

  try {
    const dataUtama = await RiwayatRawatInap.getRiwayatInapById(id);
    if (!dataUtama) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    const daftarObat = await RiwayatRawatInap.getRiwayatObatByIdRiwayat(id);
    const daftarTindakan = await RiwayatRawatInap.getRiwayatTindakanByIdRiwayat(id);

    const detail = { ...dataUtama, obat: daftarObat, tindakan: daftarTindakan };

    // header supaya browser ngerti ini file PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="laporan-${id}.pdf"`);

    const doc = new PDFDocument();
    doc.pipe(res); // langsung kirim ke response

    // isi dokumen
    doc.fontSize(20).text('Laporan Rawat Inap', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`ID Rawat Inap: ${detail.IDRIWAYATINAP}`);
    doc.text(`Pasien: ${detail.NAMALENGKAP}`);
    doc.text(`Nomor Bed: ${detail.NOMORBED}`);
    doc.text(`Tanggal Masuk: ${detail.TANGGALMASUK}`);
    doc.text(`Tanggal Keluar: ${detail.TANGGALKELUAR}`);
    doc.moveDown();
    doc.text(`Total Biaya: Rp ${detail.TOTALBIAYA.toLocaleString('id-ID')}`);

    // halaman obat
    doc.addPage().fontSize(16).text('Obat', { underline: true });
    detail.obat.forEach((o, i) => {
      doc.fontSize(12).text(`${i + 1}. ${o.NAMAOBAT} x${o.JUMLAH} = Rp ${o.TOTAL}`);
    });

    // halaman tindakan
    doc.addPage().fontSize(16).text('Tindakan', { underline: true });
    detail.tindakan.forEach((t, i) => {
      doc.fontSize(12).text(`${i + 1}. ${t.NAMATINDAKAN} x${t.JUMLAH} = Rp ${t.TOTAL}`);
    });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal generate PDF' });
  }
}
