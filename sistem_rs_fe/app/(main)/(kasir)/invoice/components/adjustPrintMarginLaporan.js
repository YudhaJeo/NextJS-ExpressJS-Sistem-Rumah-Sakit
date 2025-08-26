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

    const formatRupiah = (val) =>
      new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num(val));

    // ---------- RAWAT JALAN ----------
    if (detail.IDRIWAYATJALAN) {
      doc.setFontSize(18);
      doc.text('Detail Rawat Jalan', doc.internal.pageSize.width / 2, y, { align: 'center' });
      y += 5;

      const labelX1 = marginLeft;
      const valueX1 = marginLeft + 35;

      doc.setFontSize(12);
      doc.text('Informasi Pasien', labelX1, y);
      y += 6;

      doc.setFontSize(10);
      doc.text('Nama Pasien', labelX1, y);
      doc.text(`: ${detail.NAMAPASIEN}`, valueX1, y);
      y += 6;

      doc.text('Tanggal Rawat', labelX1, y);
      doc.text(`: ${formatTanggal(detail.TANGGALRAWATJALAN)}`, valueX1, y);
      y += 10;

      const servicesRJ = [];
      let noRJ = 1;
      const totalTindakanRJ = detail.tindakan?.reduce((acc, t) => acc + (t.TOTAL ?? 0), 0);

      detail.tindakan?.forEach((t) => {
        servicesRJ.push([
          noRJ++,
          t.NAMATINDAKAN,
          t.KATEGORI || '-',
          t.JUMLAH,
          'Tindakan',
          formatRupiah(t.HARGA),
          formatRupiah(t.TOTAL),
        ]);
      });

      autoTable(doc, {
        startY: y,
        head: [['#', 'Layanan', 'Satuan/Kategori', 'Qty', 'Jenis', 'Harga Satuan', 'Total']],
        body: servicesRJ,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [41, 128, 185], halign: 'center', fontStyle: 'bold' },
        margin: { left: marginLeft, right: marginRight },
      });

      let yAfterRJ = doc.lastAutoTable.finalY + 10;

      doc.setFontSize(12);
      doc.text('Ringkasan Biaya', marginLeft, yAfterRJ);
      yAfterRJ += 6;

      [
        ['Total Tindakan Jalan', totalTindakanRJ, true],
        ['Total Biaya Rawat Jalan', detail.TOTALBIAYAJALAN, true]
      ].forEach(([label, val, isCurrency]) => {
        doc.setFontSize(10);
        doc.text(label, marginLeft, yAfterRJ);
        doc.text(
          isCurrency ? formatRupiah(val) : String(val),
          doc.internal.pageSize.width - marginRight,
          yAfterRJ,
          { align: 'right' }
        );
        yAfterRJ += 6;
      });

      y = yAfterRJ + 10;
    }

    // ---------- RAWAT INAP ----------
    if (detail.IDRIWAYATINAP) {
      doc.setFontSize(18);
      doc.text('Detail Rawat Inap', doc.internal.pageSize.width / 2, y, { align: 'center' });
      let yInap = y + 10;

      const labelX2 = marginLeft;
      const valueX2 = marginLeft + 25;

      doc.setFontSize(12);
      doc.text('Informasi Pasien', labelX2, yInap);
      yInap += 6;

      doc.setFontSize(10);
      doc.text('Nama Pasien', labelX2, yInap);
      doc.text(`: ${detail.NAMAPASIEN ?? '-'}`, valueX2 - 2, yInap);
      yInap += 6;

      doc.text('Nomor Bed', labelX2, yInap);
      doc.text(`: ${detail.NOMORBED ?? '-'}`, valueX2 - 2, yInap);
      yInap += 10;

      doc.setFontSize(12);
      doc.text('Periode Rawat Inap', labelX2, yInap);
      yInap += 6;

      doc.setFontSize(10);
      doc.text('Masuk', labelX2, yInap);
      doc.text(`: ${formatTanggal(detail.TANGGALMASUK)}`, valueX2 - 2, yInap);
      yInap += 6;

      doc.text('Keluar', labelX2, yInap);
      doc.text(`: ${formatTanggal(detail.TANGGALKELUAR)}`, valueX2 - 2, yInap);
      yInap += 10;

      const servicesInp = [];
      servicesInp.push([
        1,
        `Biaya Kamar Rawat Inap (Bed ${detail.NOMORBED})`,
        '-',
        1,
        'Kamar',
        formatRupiah(detail.TOTALKAMAR),
        formatRupiah(detail.TOTALKAMAR)
      ]);

      detail.obat?.forEach((o) => {
        servicesInp.push([
          servicesInp.length + 1,
          o.NAMAOBAT,
          o.JENISOBAT || '-',
          o.JUMLAH,
          'Obat',
          formatRupiah(o.HARGA),
          formatRupiah(o.TOTAL)
        ]);
      });

      detail.tindakan?.forEach((t) => {
        servicesInp.push([
          servicesInp.length + 1,
          t.NAMATINDAKAN,
          t.KATEGORI || '-',
          t.JUMLAH,
          'Tindakan',
          formatRupiah(t.HARGA),
          formatRupiah(t.TOTAL)
        ]);
      });

      autoTable(doc, {
        startY: yInap,
        head: [['#', 'Layanan', 'Satuan/Kategori', 'Qty', 'Jenis', 'Harga Satuan', 'Total']],
        body: servicesInp,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [41, 128, 185], halign: 'center', fontStyle: 'bold' },
        margin: { left: marginLeft, right: marginRight },
      });

      let yAfterInv = doc.lastAutoTable.finalY + 10;

      doc.setFontSize(12);
      doc.text('Ringkasan Biaya', marginLeft, yAfterInv);
      yAfterInv += 6;

      const summary = [
        ['Biaya Kamar', detail.TOTALKAMAR],
        ['Total Obat', detail.TOTALOBAT],
        ['Total Tindakan', detail.TOTALTINDAKAN],
        ['Total Biaya', detail.TOTALBIAYA],
      ];

      summary.forEach(([label, val]) => {
        doc.setFontSize(10);
        doc.text(label, marginLeft, yAfterInv);
        doc.text(formatRupiah(val), doc.internal.pageSize.width - marginRight, yAfterInv, { align: 'right' });
        yAfterInv += 6;
      });

      y = yAfterInv + 10;
    }

    // ---------- INVOICE ----------
    if (detail.NOINVOICE) {
      if (detail.IDRIWAYATJALAN || detail.IDRIWAYATINAP) doc.addPage();

      const pageWidth = doc.internal.pageSize.width;
      let yInv = marginTop + 10;

      doc.setFontSize(18);
      doc.text('Detail Invoice', pageWidth / 2, yInv, { align: 'center' });
      yInv += 10;

      const labelX = marginLeft;
      const valueX = marginLeft + 40;

      doc.setFontSize(12);
      doc.text('Informasi Invoice', labelX, yInv);
      yInv += 6;

      doc.setFontSize(10);
      [
        ['No Invoice', detail.NOINVOICE ?? '-'],
        ['Nama Pasien', detail.NAMAPASIEN ?? '-'],
        ['NIK', detail.NIK ?? '-'],
        ['Asuransi', detail.ASURANSI ?? '-'],
        ['Tanggal Invoice', formatTanggal(detail.TANGGALINVOICE)],
        ['Status', detail.STATUS ?? detail.status ?? '-'],
      ].forEach(([label, val]) => {
        doc.text(label, labelX, yInv);
        doc.text(`: ${val}`, valueX, yInv);
        yInv += 6;
      });

      yInv += 4;

      autoTable(doc, {
        startY: yInv,
        head: [['Keterangan', 'Nominal']],
        body: [
          ['Total Tagihan', formatRupiah(detail.TOTALTAGIHAN)],
          ['Total Deposit', formatRupiah(detail.TOTALDEPOSIT)],
          ['Total Angsuran', formatRupiah(detail.TOTALANGSURAN)],
          ['Sisa Tagihan', formatRupiah(detail.SISA_TAGIHAN)],
        ],
        styles: { fontSize: 9 },
        headStyles: { fillColor: [41, 128, 185], halign: 'center', fontStyle: 'bold' },
        columnStyles: { 0: { halign: 'left' }, 1: { halign: 'right' } },
        margin: { left: marginLeft, right: marginRight },
      });

      const yEnd = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(9);
      doc.text('Terima kasih atas kepercayaan anda menggunakan layanan kami.',
        pageWidth / 2, yEnd, { align: 'center' });
    }

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