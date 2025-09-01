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
  selectedRow,
  dataInvoices = [], // ⬅️ tambahkan, untuk export semua data
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

  // ========================== EXPORT PDF ==========================
  async function exportPDF(detail, adjustConfig) {
    const doc = new jsPDF({
      orientation: adjustConfig.orientation,
      unit: 'mm',
      format: adjustConfig.paperSize,
    });

    const marginLeft = parseFloat(adjustConfig.marginLeft);
    const marginTop = parseFloat(adjustConfig.marginTop);
    const marginRight = parseFloat(adjustConfig.marginRight);

    const formatTanggal = (tanggal) =>
      tanggal
        ? new Date(tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        : '-';

    const formatRupiah = (val) =>
      new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);

    if (detail) {
      // === Export satu invoice (detail) ===
      doc.text(`Invoice: ${detail.NOINVOICE}`, marginLeft, marginTop + 10);
      autoTable(doc, {
        startY: marginTop + 20,
        head: [['Field', 'Value']],
        body: Object.entries(detail).map(([k, v]) => [k, String(v)]),
        margin: { left: marginLeft, right: marginRight },
        styles: { fontSize: 9 },
      });
    } else {
      // === Export semua invoice (list) ===
      doc.setFontSize(14);
      doc.text('Laporan Daftar Invoice', doc.internal.pageSize.width / 2, marginTop, { align: 'center' });

      autoTable(doc, {
        startY: marginTop + 10,
        head: [['No Invoice', 'Nama Pasien', 'Asuransi', 'Tanggal', 'Total Tagihan', 'Deposit', 'Angsuran', 'Sisa', 'Status']],
        body: dataInvoices.map((inv) => [
          inv.NOINVOICE,
          inv.NAMAPASIEN,
          inv.ASURANSI,
          formatTanggal(inv.TANGGALINVOICE),
          formatRupiah(inv.TOTALTAGIHAN),
          formatRupiah(inv.TOTALDEPOSIT),
          formatRupiah(inv.TOTALANGSURAN),
          formatRupiah(inv.SISA_TAGIHAN),
          inv.STATUS,
        ]),
        margin: { left: marginLeft, right: marginRight },
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        alternateRowStyles: { fillColor: [248, 249, 250] },
      });
    }

    return doc.output('datauristring');
  }

  // ========================== EXPORT EXCEL ==========================
  const exportExcel = () => {
    let ws;
    if (selectedRow) {
      // === Export satu invoice (detail) ===
      ws = XLSX.utils.json_to_sheet([selectedRow]);
    } else {
      // === Export semua invoice ===
      ws = XLSX.utils.json_to_sheet(dataInvoices);
    }
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Invoices');
    XLSX.writeFile(wb, selectedRow ? `Invoice_${selectedRow.NOINVOICE}.xlsx` : 'Laporan_Invoice.xlsx');
  };

  // ========================== HANDLE PDF EXPORT ==========================
  const handleExportPdf = async () => {
    try {
      setLoadingExport(true);
      const pdfDataUrl = await exportPDF(selectedRow, dataAdjust);
      setPdfUrl(pdfDataUrl);
      setFileName(selectedRow ? `Invoice_${selectedRow.NOINVOICE}` : 'Laporan_Invoice');
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
      footer={footer}
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
    </Dialog>
  );
}