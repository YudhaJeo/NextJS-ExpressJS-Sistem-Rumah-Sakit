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

  const addHeader = (doc, title, marginLeft, marginTop) => {
    const pageWidth = doc.internal.pageSize.width;
    const marginRight = parseFloat(dataAdjust.marginRight);

    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(0.5);
    doc.line(marginLeft, marginTop - 2, pageWidth - marginRight, marginTop - 2);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 128, 185);
    doc.text('RS BAYZA MEDICA', pageWidth / 2, marginTop + 8, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Jl. A. Yani No. 84, Kota Madiun, Jawa Timur | Telp: (0351) 876-9090', pageWidth / 2, marginTop + 14, { align: 'center' });

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(marginLeft, marginTop + 18, pageWidth - marginRight, marginTop + 18);

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(title, pageWidth / 2, marginTop + 30, { align: 'center' });

    return marginTop + 40;
  };

  const addSectionHeader = (doc, title, y, marginLeft) => {
    doc.setFillColor(250, 250, 250);
    doc.rect(marginLeft, y - 4, doc.internal.pageSize.width - marginLeft - parseFloat(dataAdjust.marginRight), 10, 'F');

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 128, 185);
    doc.text(title, marginLeft + 2, y + 2);

    return y + 12;
  };

  const addInfoRow = (doc, label, value, y, marginLeft, labelWidth = 35) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(label, marginLeft + 2, y);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`: ${value}`, marginLeft + labelWidth, y);

    return y + 5;
  };

  const addSummaryRow = (doc, label, value, y, marginLeft, isTotal = false) => {
    doc.setFontSize(isTotal ? 11 : 10);
    doc.setFont('helvetica', isTotal ? 'bold' : 'normal');
    doc.setTextColor(isTotal ? 41 : 80, isTotal ? 128 : 80, isTotal ? 185 : 80);
    doc.text(label, marginLeft + 2, y);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(isTotal ? 41 : 0, isTotal ? 128 : 0, isTotal ? 185 : 0);
    doc.text(`: ${value}`, marginLeft + 50, y);

    return y + 6;
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
    const marginBottom = parseFloat(adjustConfig.marginBottom);

    let y = marginTop + 8;

    const num = (v) => Number.isFinite(Number(v)) ? Number(v) : 0;

    const formatTanggal = (tanggal) =>
      tanggal
        ? new Date(tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        : '-';

    const formatRupiah = (val) =>
      new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num(val));

    // ---------- RAWAT JALAN ----------
    if (detail.IDRIWAYATJALAN) {
      let y = addHeader(doc, 'LAPORAN RAWAT JALAN', marginLeft, marginTop);
      y += 5;

      y = addSectionHeader(doc, 'INFORMASI PASIEN', y, marginLeft);
      y = addInfoRow(doc, 'Nama Pasien', detail.NAMAPASIEN, y, marginLeft);
      y = addInfoRow(doc, 'Tanggal Rawat', formatTanggal(detail.TANGGALRAWATJALAN), y, marginLeft);
      y += 5;

      y = addSectionHeader(doc, 'RINCIAN LAYANAN', y, marginLeft);

      const servicesRJ = [];
      let noRJ = 1;
      const totalTindakanRJ = detail.tindakanJalan?.reduce((acc, t) => acc + (t.TOTAL ?? 0), 0);

      detail.tindakanJalan?.forEach((t) => {
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
        styles: {
          fontSize: 9,
          cellPadding: 3,
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          halign: 'center',
          fontStyle: 'bold',
          fontSize: 10
        },
        alternateRowStyles: { fillColor: [248, 249, 250] },
        columnStyles: {
          0: { halign: 'center', cellWidth: 10 },
          3: { halign: 'center', cellWidth: 15 },
          5: { halign: 'right', cellWidth: 25 },
          6: { halign: 'right', cellWidth: 25 }
        },
        margin: { left: marginLeft, right: marginRight },
      });

      let yAfterRJ = doc.lastAutoTable.finalY + 10;

      y = addSectionHeader(doc, 'RINGKASAN BIAYA', yAfterRJ, marginLeft);

      y = addSummaryRow(doc, 'Total Tindakan Jalan', formatRupiah(totalTindakanRJ), y, marginLeft);
      y = addSummaryRow(doc, 'Total Biaya Rawat Jalan', formatRupiah(detail.TOTALBIAYAJALAN), y, marginLeft, true);

      y = y + 10;
    }

    // ---------- RAWAT INAP ----------
    if (detail.IDRIWAYATINAP) {
      if (detail.IDRIWAYATJALAN) {
        doc.addPage();
        y = marginTop;
      }

      y = addHeader(doc, 'LAPORAN RAWAT INAP', marginLeft, y);
      y += 5;

      y = addSectionHeader(doc, 'INFORMASI PASIEN', y, marginLeft);
      y = addInfoRow(doc, 'Nama Pasien', detail.NAMAPASIEN ?? '-', y, marginLeft);
      y = addInfoRow(doc, 'Nomor Bed', detail.NOMORBED ?? '-', y, marginLeft);
      y += 5;

      y = addSectionHeader(doc, 'PERIODE RAWAT INAP', y, marginLeft);
      y = addInfoRow(doc, 'Tanggal Masuk', formatTanggal(detail.TANGGALMASUK), y, marginLeft);
      y = addInfoRow(doc, 'Tanggal Keluar', formatTanggal(detail.TANGGALKELUAR), y, marginLeft);
      y += 5;

      y = addSectionHeader(doc, 'RINCIAN LAYANAN', y, marginLeft);

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

      detail.alkes?.forEach((a) => {
        servicesInp.push([
          servicesInp.length + 1,
          a.NAMAALKES,
          a.JENISALKES || '-',
          a.JUMLAH,
          'Alkes',
          formatRupiah(a.HARGA),
          formatRupiah(a.TOTAL)
        ])
      })

      detail.tindakanInap?.forEach((t) => {
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
        startY: y,
        head: [['#', 'Layanan', 'Satuan/Kategori', 'Qty', 'Jenis', 'Harga Satuan', 'Total']],
        body: servicesInp,
        styles: {
          fontSize: 9,
          cellPadding: 3,
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          halign: 'center',
          fontStyle: 'bold',
          fontSize: 10
        },
        alternateRowStyles: { fillColor: [248, 249, 250] },
        columnStyles: {
          0: { halign: 'center', cellWidth: 10 },
          3: { halign: 'center', cellWidth: 15 },
          5: { halign: 'right', cellWidth: 25 },
          6: { halign: 'right', cellWidth: 25 }
        },
        margin: { left: marginLeft, right: marginRight },
      });

      let yAfterInv = doc.lastAutoTable.finalY + 10;

      let ySummary = addSectionHeader(doc, 'RINGKASAN BIAYA', yAfterInv, marginLeft);

      const summary = [
        ['Biaya Kamar', detail.TOTALKAMAR],
        ['Total Obat', detail.TOTALOBAT],
        ['Total Alkes', detail.TOTALALKES],
        ['Total Tindakan', detail.TOTALTINDAKAN],
        ['TOTAL BIAYA', detail.TOTALBIAYA],
      ];

      summary.forEach(([label, val], index) => {
        const isTotal = index === summary.length - 1;
        ySummary = addSummaryRow(doc, label, formatRupiah(val), ySummary, marginLeft, isTotal);
      });

      y = ySummary + 10;
    }

    // ---------- INVOICE ----------
    if (detail.NOINVOICE) {
      if (detail.IDRIWAYATJALAN || detail.IDRIWAYATINAP) {
        doc.addPage();
        y = marginTop;
      }

      y = addHeader(doc, 'INVOICE PEMBAYARAN', marginLeft, y);
      y += 5;

      y = addSectionHeader(doc, 'INFORMASI INVOICE', y, marginLeft);

      const invoiceInfo = [
        ['No Invoice', detail.NOINVOICE ?? '-'],
        ['Nama Pasien', detail.NAMAPASIEN ?? '-'],
        ['NIK', detail.NIK ?? '-'],
        ['Asuransi', detail.ASURANSI ?? '-'],
        ['Tanggal Invoice', formatTanggal(detail.TANGGALINVOICE)],
        ['Status', detail.STATUS ?? detail.status ?? '-'],
      ];

      invoiceInfo.forEach(([label, val]) => {
        y = addInfoRow(doc, label, val, y, marginLeft, 40);
      });

      y += 5;

      y = addSectionHeader(doc, 'RINCIAN PEMBAYARAN', y, marginLeft);

      const paymentData = [
        ['Total Tagihan', formatRupiah(detail.TOTALTAGIHAN)],
        ['Total Deposit', formatRupiah(detail.TOTALDEPOSIT)],
        ['Total Angsuran', formatRupiah(detail.TOTALANGSURAN)],
        ['Sisa Tagihan', formatRupiah(detail.SISA_TAGIHAN)],
      ];

      autoTable(doc, {
        startY: y,
        head: [['Keterangan', 'Nominal']],
        body: paymentData,
        styles: {
          fontSize: 11,
          cellPadding: 3,
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
          halign: 'left',
          fillColor: [245, 245, 245]
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
          halign: 'center',
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { fontStyle: 'bold', halign: 'left', cellWidth: 60 },
          1: { halign: 'right', fontStyle: 'bold', textColor: [41, 128, 185] }
        },
        margin: { left: marginLeft, right: marginRight },
        tableWidth: 'auto',
        didParseCell: function (data) {
          if (data.section === 'body' && data.row.index === paymentData.length - 1) {
            data.cell.styles.fillColor = [220, 53, 69];
            data.cell.styles.textColor = [255, 255, 255];
            data.cell.styles.fontSize = 12;
            data.cell.styles.fontStyle = 'bold';
          }
        }
      });

      const yEnd = doc.lastAutoTable.finalY + 20;

      doc.setDrawColor(41, 128, 185);
      doc.setLineWidth(0.3);
      doc.line(marginLeft, yEnd - 5, doc.internal.pageSize.width - marginRight, yEnd - 5);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 100, 100);
      doc.text('Terima kasih atas kepercayaan Anda menggunakan layanan kami.',
        doc.internal.pageSize.width / 2, yEnd + 2, { align: 'center' });
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