'use client'

import React, { useState } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber } from 'primereact/inputnumber'
import { Toolbar } from 'primereact/toolbar'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function AdjustPrintMarginLaporan({
  adjustDialog,
  setAdjustDialog,
  selectedRow,
  setPdfUrl,
  setFileName,
  setJsPdfPreviewOpen
}) {
  const [loadingExport, setLoadingExport] = useState(false)
  const [dataAdjust, setDataAdjust] = useState({
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 10,
    paperSize: 'A4',
    orientation: 'portrait'
  })

  const paperSizes = [
    { name: 'A4', value: 'A4' },
    { name: 'Letter', value: 'Letter' },
    { name: 'Legal', value: 'Legal' }
  ]
  const orientationOptions = [
    { label: 'Potrait', value: 'portrait' },
    { label: 'Lanskap', value: 'landscape' }
  ]

  const onInputChangeNumber = (e, name) => {
    setDataAdjust((prev) => ({ ...prev, [name]: e.value || 0 }))
  }
  const onInputChange = (e, name) => {
    setDataAdjust((prev) => ({ ...prev, [name]: e.value }))
  }

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
      }).format(val || 0);

    doc.setFontSize(18);
    doc.text('Komisi Dokter', doc.internal.pageSize.width / 2, y, { align: 'center' });
    y += 5;

    doc.setFontSize(10);
    doc.text(`ID Transaksi: #${detail.IDKOMISI}`, doc.internal.pageSize.width / 2, y, { align: 'center' });
    y += 15;

    const labelX = marginLeft;
    const valueX = marginLeft + 25;

    doc.setFontSize(12);
    doc.text('Informasi Komisi', labelX, y);
    y += 6;

    doc.setFontSize(10);
    doc.text('Nama Pasien', labelX, y);
    doc.text(`: ${detail.NAMAPASIEN}`, valueX - 2, y);
    y += 6;

    doc.text('Nama Dokter', labelX, y);
    doc.text(`: ${detail.NAMADOKTER}`, valueX - 2, y);
    y += 10;

    doc.setFontSize(12);
    doc.text('Periode Tanggal Kunjungan & Komisi', labelX, y);
    y += 6;

    doc.setFontSize(10);
    doc.text('Tanggal', labelX, y);
    doc.text(`: ${formatTanggal(detail.TANGGALKUNJUNGAN)}`, valueX - 2, y);
    y += 6;

    const services = [];
    let no = 1;

    services.push([
      1,
      `Biaya Komisi Dokter (${detail.NAMAPASIEN})`,
      '-',
      1,
      'Komisi',
      formatRupiah(detail.NILAIKOMISI),
      formatRupiah(detail.NILAIKOMISI)
    ])

    autoTable(doc, {
      startY: y,
      head: [['#', 'Layanan', 'Satuan/Kategori', 'Qty', 'Jenis', 'Harga Satuan', 'Total']],
      body: services,
      styles: { fontSize: 9, lineColor: [200, 200, 200], lineWidth: 0.1 },
      headStyles: {
        fillColor: [245, 246, 250],
        textColor: 20,
        halign: 'center',
        fontStyle: 'bold',
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: 20,
      },
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

    doc.setFontSize(12);
    doc.text('Ringkasan Biaya', marginLeft, y2);
    y2 += 6;
    const summary = [
      ['Biaya Komisi Dokter', detail.NILAIKOMISI],
    ];

    summary.forEach(([label, val]) => {
      doc.setFontSize(10);
      doc.text(label, marginLeft, y2);
      doc.text(formatRupiah(val), doc.internal.pageSize.width - marginRight, y2, { align: 'right' });
      y2 += 6;
    });

    y2 += 10;

    doc.setFontSize(9);
    doc.text(
      'Terima kasih atas kepercayaan anda menggunakan layanan kami.',
      doc.internal.pageSize.width / 2,
      y2,
      { align: 'center' }
    );

    return doc.output('datauristring');
  }

  const handleExportPdf = async () => {
    if (!selectedRow) return
    try {
      setLoadingExport(true)

      const pdfDataUrl = await exportPDF(selectedRow, dataAdjust)
      setPdfUrl(pdfDataUrl)
      setFileName(`Laporan_Komisi_${selectedRow.NAMAPASIEN}`)
      setAdjustDialog(false)
      setJsPdfPreviewOpen(true)
    } finally {
      setLoadingExport(false)
    }
  }  

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
  )

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
  )
}