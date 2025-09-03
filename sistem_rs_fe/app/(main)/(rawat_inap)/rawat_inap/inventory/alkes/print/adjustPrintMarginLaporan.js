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
  dataAlkes = [],
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
    const contentWidth = pageWidth - marginLeft - marginRight;

    doc.setFillColor(245, 248, 255); 
    doc.rect(marginLeft, marginTop, contentWidth, 45, 'F');
    
    doc.setFillColor(41, 128, 185); 
    doc.rect(marginLeft, marginTop, contentWidth, 3, 'F');

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 128, 185);
    doc.text('RS BAYZA MEDIKA', pageWidth / 2, marginTop + 12, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 100, 100);
    doc.text('Melayani dengan Sepenuh Hati', pageWidth / 2 , marginTop + 18, { align: 'center' });

    doc.setFontSize(10);  
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text('Alamat: Jl. A. Yani No. 84, Kota Madiun, Jawa Timur', pageWidth / 2, marginTop + 25, { align: 'center' });
    doc.text('Telepon: (0351) 876-9090', pageWidth / 2, marginTop + 30, { align: 'center' });

    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(1);
    doc.line(marginLeft, marginTop + 38, pageWidth - marginRight, marginTop + 38);

    doc.setDrawColor(200, 220, 240);
    doc.setLineWidth(0.5);
    doc.line(marginLeft, marginTop + 40, pageWidth - marginRight, marginTop + 40);

    const titleY = marginTop + 45; 
    const titleHeight = 12;
    
    doc.setFillColor(41, 128, 185);
    doc.rect(marginLeft, titleY - 8, contentWidth, titleHeight, 'F');
    
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text(title, pageWidth / 2, titleY - 1, { align: 'center' });

    const today = new Date();
    const dateStr = today.toLocaleDateString('id-ID', {
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      weekday: 'long'
    });
    const timeStr = today.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const infoY = titleY + 15;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(80, 80, 80);
    doc.text(`Dicetak: ${dateStr}`, marginLeft + 5, marginTop + 55, { align: 'left' });

    return marginTop + 60;
  };

  async function exportPDF(adjustConfig) {
    const doc = new jsPDF({
      orientation: adjustConfig.orientation,
      unit: 'mm',
      format: adjustConfig.paperSize,
    });

    const marginLeft = parseFloat(adjustConfig.marginLeft);
    const marginTop = parseFloat(adjustConfig.marginTop);
    const marginRight = parseFloat(adjustConfig.marginRight);

    const startY = addHeader(doc, 'DATA ALKES', marginLeft, marginTop, marginRight);

    autoTable(doc, {
      startY: startY,
      head: [[
        'ID',
        'Kode Alkes',
        'Nama Alkes',
        'Merek',
        'Jenis Alkes',
        'Stok',
        'Harga Beli',
        'Harga Jual',
        'Tgl Kadaluarsa',
        'Supplier',
        'Lokasi',
      ]],
      body: dataAlkes.map((alkes) => [
        alkes.IDALKES,
        alkes.KODEALKES,
        alkes.NAMAALKES,
        alkes.MERKALKES,
        alkes.JENISALKES,
        alkes.STOK,
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(alkes.HARGABELI || 0),
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(alkes.HARGAJUAL || 0),
        alkes.TGLKADALUARSA,
        alkes.NAMASUPPLIER,
        alkes.LOKASI,
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
    const exportData = dataAlkes.map((alkes) => ({
      ID: alkes.IDALKES,
      'Kode Alkes': alkes.KODEALKES,
      'Nama Alkes': alkes.NAMAALKES,
      'Merek': alkes.MERKALKES,
      'Jenis Alkes': alkes.JENISALKES,
      'Stok': alkes.STOK,
      'Harga Beli': new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(alkes.HARGABELI || 0),
      'Harga Jual': new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(alkes.HARGAJUAL || 0),
      'Tgl Kadaluarsa': alkes.TGLKADALUARSA,
      'Supplier': alkes.NAMASUPPLIER,
      'Lokasi': alkes.LOKASI,
      'Deskripsi': alkes.DESKRIPSI,
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Alkes');
    XLSX.writeFile(wb, 'Master_Alkes.xlsx');
  };

  const handleExportPdf = async () => {
    try {
      setLoadingExport(true);
      const pdfDataUrl = await exportPDF(dataAdjust);
      setPdfUrl(pdfDataUrl);
      setFileName('Laporan_Alkes');
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