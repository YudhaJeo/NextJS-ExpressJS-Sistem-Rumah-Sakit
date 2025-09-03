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

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 128, 185);
    doc.text('RS BAYZA MEDIKA', pageWidth / 2, marginTop + 6, { align: 'center' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Jl. A. Yani No. 84, Kota Madiun, Jawa Timur | Telp: (0351) 876-9090',
      pageWidth / 2, marginTop + 12, { align: 'center' });

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(marginLeft, marginTop + 16, pageWidth - marginRight, marginTop + 16);

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(title, pageWidth / 2, marginTop + 28, { align: 'center' });

    return marginTop + 40;
  };

  const addSectionHeader = (doc, title, y, marginLeft) => {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 128, 185);
    doc.text(title, marginLeft, y);
    return y + 8;
  };

  const addInfoRow = (doc, label, value, y, marginLeft, labelWidth = 40) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(label, marginLeft, y);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`: ${value}`, marginLeft + labelWidth, y);

    return y + 5;
  };

  const formatTanggal = (tanggal) =>
    tanggal
      ? new Date(tanggal).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : '-';

  const formatRupiah = (val) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Number(val) || 0);

  async function exportPDF(detail, adjustConfig) {
    const doc = new jsPDF({
      orientation: adjustConfig.orientation,
      unit: 'mm',
      format: adjustConfig.paperSize,
    });

    const marginLeft = parseFloat(adjustConfig.marginLeft);
    const marginTop = parseFloat(adjustConfig.marginTop);
    const marginRight = parseFloat(adjustConfig.marginRight);

    let y = addHeader(doc, 'INVOICE PEMBAYARAN', marginLeft, marginTop);

    y = addSectionHeader(doc, 'INFORMASI PASIEN', y, marginLeft);
    y = addInfoRow(doc, 'No Pembayaran', detail.NOPEMBAYARAN, y, marginLeft);
    y = addInfoRow(doc, 'No Invoice', detail.NOINVOICE, y, marginLeft);
    y = addInfoRow(doc, 'Nama Pasien', detail.NAMAPASIEN, y, marginLeft);
    y = addInfoRow(doc, 'NIK', detail.NIK, y, marginLeft);
    y = addInfoRow(doc, 'Asuransi', detail.ASURANSI || '-', y, marginLeft);
    y = addInfoRow(doc, 'Tanggal Bayar', formatTanggal(detail.TANGGALBAYAR), y, marginLeft);
    y += 5;

    y = addSectionHeader(doc, 'RINCIAN PEMBAYARAN', y, marginLeft);
    autoTable(doc, {
      startY: y,
      head: [['Keterangan', 'Isi']],
      body: [
        ['Metode Pembayaran', detail.METODEPEMBAYARAN],
        ['Bank', detail.NAMA_BANK || '-'],
        ['Jumlah Bayar', formatRupiah(detail.JUMLAHBAYAR)],
        ['Keterangan', detail.KETERANGAN || '-'],
      ],
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 },
        1: { halign: 'right' },
      },
      margin: { left: marginLeft, right: marginRight },
    });

    const yEnd = doc.lastAutoTable.finalY + 20;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text(
      'Terima kasih atas kepercayaan Anda menggunakan layanan kami.',
      doc.internal.pageSize.width / 2,
      yEnd,
      { align: 'center' }
    );

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