'use client'

import React, { useState } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber } from 'primereact/inputnumber'
import { Toolbar } from 'primereact/toolbar'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

export default function AdjustPrintMarginLaporan({
  adjustDialog,
  setAdjustDialog,
  data = [],
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

  const addHeader = (doc, title, marginLeft, marginTop, marginRight) => {
    const pageWidth = doc.internal.pageSize.width;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 128, 185);
    doc.text('RS BAYZA MEDICA', pageWidth / 2, marginTop + 5, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text('Jl. A. Yani No. 84, Kota Madiun, Jawa Timur | Telp: (0351) 876-9090', pageWidth / 2, marginTop + 11, { align: 'center' });

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(marginLeft, marginTop + 14, pageWidth - marginRight, marginTop + 14);

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(title, pageWidth / 2, marginTop + 25, { align: 'center' });

    const today = new Date().toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text(`Dicetak: ${today}`, marginLeft, marginTop + 32, { align: 'left' });

    return marginTop + 40;
  };

  // Fungsi bantu untuk format tanggal konsisten
  function formatTanggal(tanggal) {
    if (!tanggal) return '-';
    // Jika string ISO (ada 'T'), format ke lokal
    if (typeof tanggal === 'string' && tanggal.includes('T')) {
      const d = new Date(tanggal);
      if (!isNaN(d)) {
        return d.toLocaleString('id-ID', {
          day: '2-digit', month: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit', hour12: false
        });
      }
    }
    // Jika bukan ISO, tampilkan apa adanya
    return tanggal;
  }

  async function exportPDF(adjustConfig) {
    const doc = new jsPDF({
      orientation: adjustConfig.orientation,
      unit: 'mm',
      format: adjustConfig.paperSize,
    });

    const marginLeft = parseFloat(adjustConfig.marginLeft);
    const marginTop = parseFloat(adjustConfig.marginTop);
    const marginRight = parseFloat(adjustConfig.marginRight);

    const startY = addHeader(doc, 'DATA LOG TRANSAKSI STOK OBAT DAN ALAT KESEHATAN', marginLeft, marginTop, marginRight);

    autoTable(doc, {
      startY: startY,
      head: [[
        'ID',
        'Tanggal',
        'Tipe',
        'Status',
        'Total'
      ]],
      body: data.map((transaksi) => [
        transaksi.ID,
        formatTanggal(transaksi.TANGGAL),
        transaksi.STATUS,
        transaksi.TIPE,
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(transaksi.TOTAL || 0),
      ]),
      margin: { left: marginLeft, right: marginRight },
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [248, 249, 250] },
    });

    return doc.output('datauristring');
  }

  const exportExcel = () => {
    // urutkan dan format data sesuai tabel
    const exportData = data.map((transaksi) => ({
      ID: transaksi.ID,
      'Tanggal': transaksi.TANGGAL,
      'Nama Transaksi': transaksi.STATUS,
      'Status': transaksi.MERKTRANSAKSI,
      'Tipe': transaksi.TIPE,
      'Total': new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(transaksi.HARGABELI || 0),
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transaksi');
    XLSX.writeFile(wb, 'Master_Transaksi.xlsx');
  };

  const handleExportPdf = async () => {
    try {
      setLoadingExport(true);
      const pdfDataUrl = await exportPDF(dataAdjust);
      setPdfUrl(pdfDataUrl);
      setFileName('Laporan_Transaksi');
      setAdjustDialog(false);
      setJsPdfPreviewOpen(true);
    } finally {
      setLoadingExport(false);
    }
  };

  const footer = () => (
    <div className="flex flex-row gap-2">
      <Button
        label="Export Excel"
        icon="pi pi-file-excel"
        severity="success"
        onClick={exportExcel}
      />
      <Button
        label="Export PDF"
        icon="pi pi-file-pdf"
        severity="danger"
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