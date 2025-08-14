'use client'

import React, { useState } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber } from 'primereact/inputnumber'
import { Toolbar } from 'primereact/toolbar'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function AdjustPrintMarginLaporan({
  adjustDialog,
  setAdjustDialog,
  selectedRow,
  setPdfUrl,
  setFileName,
  setJsPdfPreviewOpen,
}) {
  const [loadingExport, setLoadingExport] = useState(false);
  const [dataAdjust, setDataAdjust] = useState({
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 10,
    paperSize: 'A4',
    orientation: 'portrait',
  });

  const paperSizes = [
    { name: 'A4', value: 'A4' },
    { name: 'Letter', value: 'Letter' },
    { name: 'Legal', value: 'Legal' },
  ];
  const orientationOptions = [
    { label: 'Potrait', value: 'portrait' },
    { label: 'Lanskap', value: 'landscape' },
  ];

  const onInputChangeNumber = (e, name) => {
    setDataAdjust((prev) => ({ ...prev, [name]: e.value || 0 }));
  };

  const onInputChange = (e, name) => {
    setDataAdjust((prev) => ({ ...prev, [name]: e.value }));
  };

 async function exportPDF(detail, adjustConfig) {
  const doc = new jsPDF({
    orientation: adjustConfig.orientation,
    unit: 'mm',
    format: adjustConfig.paperSize,
  });

  const marginLeft = parseFloat(adjustConfig.marginLeft);
  const marginTop = parseFloat(adjustConfig.marginTop);
  const marginRight = parseFloat(adjustConfig.marginRight);

  let y = marginTop + 10;

  const num = (v) => Number.isFinite(Number(v)) ? Number(v) : 0;

  const formatTanggal = (tanggal) =>
    tanggal
      ? new Date(tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      : '-';

  const formatDateTime = (tanggal) =>
    tanggal
      ? new Date(tanggal).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      : '-';

  const formatRupiah = (val) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num(val));

  // --- Totals dari backend (fallback ke 0 bila null) ---
  const totalKamar = num(detail.TOTALKAMAR);
  const totalObat = num(detail.TOTALOBAT);
  const totalTindakan = num(detail.TOTALTINDAKAN);
  const totalBiaya = num(detail.TOTALBIAYA) || (totalKamar + totalObat + totalTindakan);

  const totalTagihan = num(detail.TOTALTAGIHAN) || totalBiaya;
  const totalDeposit = num(detail.TOTALDEPOSIT);
  const totalAngsuran = num(detail.TOTALANGSURAN);
  const sisaTagihan = num(detail.SISA_TAGIHAN) || (totalTagihan - totalDeposit - totalAngsuran);

  // === HEADER ===
  doc.setFontSize(18);
  doc.text('Detail Invoice', doc.internal.pageSize.width / 2, y, { align: 'center' });
  y += 10;

  doc.setFontSize(10);
  doc.text(`ID Transaksi: #${detail.IDINVOICE ?? '-'}`, doc.internal.pageSize.width / 2, y, { align: 'center' });
  y += 15;

  const labelX = marginLeft;
  const valueX = marginLeft + 25;

  doc.setFontSize(12);
  doc.text('Informasi Pasien', labelX, y);
  y += 6;

  doc.setFontSize(10);
  doc.text('Nama Pasien', labelX, y);
  doc.text(`: ${detail.NAMALENGKAP ?? '-'}`, valueX - 2, y);
  y += 6;

  doc.text('Nomor Bed', labelX, y);
  doc.text(`: ${detail.NOMORBED ?? '-'}`, valueX - 2, y);
  y += 10;

  doc.setFontSize(12);
  doc.text('Periode Rawat Inap', labelX, y);
  y += 6;

  doc.setFontSize(10);
  doc.text('Masuk', labelX, y);
  doc.text(`: ${formatTanggal(detail.TANGGALMASUK)}`, valueX - 2, y);
  y += 6;

  doc.text('Keluar', labelX, y);
  doc.text(`: ${formatTanggal(detail.TANGGALKELUAR)}`, valueX - 2, y);
  y += 10;

  // === TABEL LAYANAN ===
  const services = [];

  // Baris kamar
  services.push([
    1,
    `Biaya Kamar Rawat Inap${detail.NOMORBED ? ` (Bed ${detail.NOMORBED})` : ''}`,
    '-',
    1,
    'Kamar',
    formatRupiah(totalKamar),
    formatRupiah(totalKamar)
  ]);

  // Obat
  (detail.obat || []).forEach((o, i) => {
    const harga = num(o.HARGA);
    const jumlah = num(o.JUMLAH);
    const total = num(o.TOTAL) || (harga * jumlah);
    services.push([i + 2, o.NAMAOBAT ?? '-', o.JENISOBAT ?? '-', jumlah, 'Obat', formatRupiah(harga), formatRupiah(total)]);
  });

  // Tindakan
  (detail.tindakan || []).forEach((t, i) => {
    const harga = num(t.HARGA);
    const jumlah = num(t.JUMLAH);
    const total = num(t.TOTAL) || (harga * jumlah);
    services.push([services.length + 1, t.NAMATINDAKAN ?? '-', t.KATEGORI ?? '-', jumlah, 'Tindakan', formatRupiah(harga), formatRupiah(total)]);
  });

  autoTable(doc, {
    startY: y,
    head: [['#', 'Layanan', 'Satuan/Kategori', 'Qty', 'Jenis', 'Harga Satuan', 'Total']],
    body: services,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [245, 246, 250], textColor: 20, halign: 'center', fontStyle: 'bold' },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      2: { halign: 'center', cellWidth: 25 },
      3: { halign: 'center', cellWidth: 12 },
      4: { halign: 'center', cellWidth: 25 },
      5: { halign: 'right' },
      6: { halign: 'right' },
    },
    margin: { left: marginLeft, right: marginRight },
  });

  let y2 = doc.lastAutoTable.finalY + 10;

  // === RINGKASAN BIAYA ===
  doc.setFontSize(12);
  doc.text('Ringkasan Biaya', marginLeft, y2);
  y2 += 6;

  const summary = [
    ['Biaya Kamar', totalKamar],
    ['Total Obat', totalObat],
    ['Total Tindakan', totalTindakan],
    ['Total Biaya', totalBiaya],
  ];

  summary.forEach(([label, val]) => {
    doc.setFontSize(10);
    doc.text(label, marginLeft, y2);
    doc.text(formatRupiah(val), doc.internal.pageSize.width - marginRight, y2, { align: 'right' });
    y2 += 6;
  });

  y2 += 10;

  // === TABEL DETAIL INVOICE ===
  autoTable(doc, {
    startY: y2,
    head: [['Keterangan', 'Isi']],
    body: [
      ['No Invoice', detail.NOINVOICE ?? '-'],
      ['Nama Pasien', detail.NAMALENGKAP ?? '-'],
      ['NIK', detail.NIK ?? '-'],
      ['Asuransi', detail.ASURANSI ?? '-'],
      ['Tanggal Invoice', formatTanggal(detail.TANGGALINVOICE)],
      ['Tanggal Dibuat', formatDateTime(detail.CREATED_AT)],
      ['Status', detail.STATUS ?? '-'],
      ['Total Tagihan', formatRupiah(totalTagihan)],
      ['Total Deposit', formatRupiah(totalDeposit)],
      ['Total Angsuran', formatRupiah(totalAngsuran)],
      ['Sisa Tagihan', formatRupiah(sisaTagihan)],
    ],
    styles: { fontSize: 9 },
    margin: { left: marginLeft, right: marginRight },
  });

  const y3 = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(9);
  doc.text('Terima kasih atas kepercayaan anda menggunakan layanan kami.', doc.internal.pageSize.width / 2, y3, { align: 'center' });

  return doc.output('datauristring');
}



  const handleExportPdf = async () => {
    if (!selectedRow) return;
    try {
      setLoadingExport(true);
      const pdfDataUrl = await exportPDF(selectedRow, dataAdjust);
      setPdfUrl(pdfDataUrl);
      setFileName(`Invoice_${selectedRow.NOINVOICE}`);
      setAdjustDialog(false);
      setJsPdfPreviewOpen(true);
    } finally {
      setLoadingExport(false);
    }
  };

  const footer = () => (
    <div className="flex flex-row">
      <Button
        label="Export PDF"
        icon="pi pi-file"
        className="p-button-danger"
        onClick={handleExportPdf}
        loading={loadingExport}
      />
    </div>
  );

  return (
    <Dialog
      visible={adjustDialog}
      onHide={() => setAdjustDialog(false)}
      header="Pengaturan Cetak"
      style={{ width: '50vw' }}
    >
      <div className="grid p-fluid">
        <div className="col-12 md:col-6">
          <div className="grid formgrid">
            <h5 className="col-12 mb-2">Pengaturan Margin (mm)</h5>
            {['Top', 'Bottom', 'Right', 'Left'].map((label) => (
              <div className="col-6 field" key={label}>
                <label>Margin {label}</label>
                <InputNumber
                  value={dataAdjust[`margin${label}`]}
                  onChange={(e) => onInputChangeNumber(e, `margin${label}`)}
                  min={0}
                  suffix=" mm"
                  showButtons
                  className="w-full"
                  inputStyle={{ padding: '0.3rem' }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="col-12 md:col-6">
          <div className="grid formgrid">
            <h5 className="col-12 mb-2">Pengaturan Kertas</h5>
            <div className="col-12 field">
              <label>Ukuran Kertas</label>
              <Dropdown
                value={dataAdjust.paperSize}
                options={paperSizes}
                onChange={(e) => onInputChange(e, 'paperSize')}
                optionLabel="name"
                className="w-full"
              />
            </div>
            <div className="col-12 field">
              <label>Orientasi</label>
              <Dropdown
                value={dataAdjust.orientation}
                options={orientationOptions}
                onChange={(e) => onInputChange(e, 'orientation')}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
      <Toolbar className="py-2 justify-content-end" end={footer} />
    </Dialog>
  );
}