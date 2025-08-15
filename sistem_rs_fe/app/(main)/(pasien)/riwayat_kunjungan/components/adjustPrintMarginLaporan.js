'use client'

import React, { useState } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber } from 'primereact/inputnumber'
import { Toolbar } from 'primereact/toolbar'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function AdjustPrintMarginLaporanKunjungan({
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

    // === HEADER ===
    doc.setFontSize(18);
    doc.text('Detail Riwayat Kunjungan', doc.internal.pageSize.width / 2, y, { align: 'center' });
    y += 10;

    doc.setFontSize(12);
    doc.text(`Nama Pasien : ${detail.NAMALENGKAP}`, marginLeft, y); y += 6;
    doc.text(`NIK : ${detail.NIK}`, marginLeft, y); y += 6;
    doc.text(`Tanggal Kunjungan : ${formatTanggal(detail.TANGGALKUNJUNGAN)}`, marginLeft, y); y += 6;
    doc.text(`Poli : ${detail.POLI}`, marginLeft, y); y += 6;
    doc.text(`Keluhan : ${detail.KELUHAN}`, marginLeft, y); y += 6;
    doc.text(`Status : ${detail.STATUSKUNJUNGAN}`, marginLeft, y); y += 10;

    autoTable(doc, {
      startY: y,
      head: [['Keterangan', 'Isi']],
      body: [
        ['Nama Pasien', detail.NAMALENGKAP],
        ['NIK', detail.NIK],
        ['Tanggal Kunjungan', formatTanggal(detail.TANGGALKUNJUNGAN)],
        ['Poli', detail.POLI],
        ['Keluhan', detail.KELUHAN],
        ['Status', detail.STATUSKUNJUNGAN],
      ],
      styles: { fontSize: 9 },
      margin: { left: marginLeft, right: marginRight },
    });

    return doc.output('datauristring');
  }

  const handleExportPdf = async () => {
    if (!selectedRow) return
    try {
      setLoadingExport(true)
      const pdfDataUrl = await exportPDF(selectedRow, dataAdjust)
      setPdfUrl(pdfDataUrl)
      setFileName(`Riwayat_Kunjungan_${selectedRow.IDPENDAFTARAN}`)
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