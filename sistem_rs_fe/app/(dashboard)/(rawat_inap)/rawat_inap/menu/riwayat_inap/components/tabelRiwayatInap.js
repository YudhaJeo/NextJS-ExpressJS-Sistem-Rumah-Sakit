// app/(dashboard)/(rawat_inap)/riwayat_inap/components/tabelRiwayatInap.js
'use client'

import React, { useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import AdjustPrintMarginLaporan from './adjustPrintMarginLaporan'
import dynamic from 'next/dynamic'
import axios from 'axios'
const API_URL = process.env.NEXT_PUBLIC_API_URL

const TabelRiwayatInap = ({ data, loading }) => {
  const [adjustDialog, setAdjustDialog] = useState(false)
  const [jsPdfPreviewOpen, setJsPdfPreviewOpen] = useState(false)
  const [pdfUrl, setPdfUrl] = useState('')
  const [fileName, setFileName] = useState('')
  const [selectedRow, setSelectedRow] = useState(null)
  
  const PDFViewer = dynamic(() => import('./PDFViewer'), {
    ssr: false,
  })

  const formatTanggal = (tanggal) => {
    if (!tanggal) return '-'
    const tgl = new Date(tanggal)
    return tgl.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatRupiah = (value) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value || 0)

  const btnAdjust = (row) => {
    setSelectedRow(row)
    setAdjustDialog(true)
  }

  const handleAdjust = async (adjustConfig) => {
    if (!selectedRow?.IDRIWAYATINAP) return
  
    // langsung buat url ke backend
    const pdfLink = `${API_URL}/riwayat_inap/${selectedRow.IDRIWAYATINAP}/pdf`
  
    setPdfUrl(pdfLink)
    setFileName(`Laporan_RawatInap_${selectedRow.IDRIWAYATINAP}`)
    setSelectedRow({
      ...selectedRow,
      paperSize: adjustConfig.paperSize
    })
  
    setAdjustDialog(false)
    setJsPdfPreviewOpen(true)
  }

  const exportExcel = () => {
    if (!selectedRow) {
      console.warn('tidak ada baris yang dipilih')
      return
    }
    // fungsi export excel
  }

  const actionBody = (rowData) => (
    <div className="flex gap-2 justify-center">
      <a
        href={`/rawat_inap/menu/riwayat_inap/${rowData.IDRIWAYATINAP}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button
          icon="pi pi-eye"
          className="p-button-sm"
          tooltip="Lihat Detail"
        />
      </a>
      <Button
        icon="pi pi-sliders-h"
        className="p-button-sm p-button-warning"
        onClick={() => btnAdjust(rowData)}
        tooltip="Atur Margin"
      />
    </div>
  )

  return (
    <>
      <DataTable value={data} paginator rows={10} loading={loading} size="small" scrollable>
        <Column field="NAMALENGKAP" header="Pasien" />
        <Column field="NOMORBED" header="Bed" />
        <Column field="TOTALOBAT" header="Total Obat" body={(row) => formatRupiah(row.TOTALOBAT)} />
        <Column field="TOTALTINDAKAN" header="Total Tindakan" body={(row) => formatRupiah(row.TOTALTINDAKAN)} />
        <Column field="TOTALKAMAR" header="Total Kamar" body={(row) => formatRupiah(row.TOTALKAMAR)} />
        <Column field="TOTALBIAYA" header="Tagihan Total" body={(row) => formatRupiah(row.TOTALBIAYA)} />
        <Column field="TANGGALMASUK" header="Tanggal Masuk" body={(row) => formatTanggal(row.TANGGALMASUK)} />
        <Column field="TANGGALKELUAR" header="Tanggal Keluar" body={(row) => formatTanggal(row.TANGGALKELUAR)} />
        <Column header="Aksi" body={actionBody} style={{ width: '150px', textAlign: 'center' }} />
      </DataTable>

      <AdjustPrintMarginLaporan
        adjustDialog={adjustDialog}
        setAdjustDialog={setAdjustDialog}
        handleAdjust={handleAdjust}
        excel={exportExcel}
      />

      {/* dialog preview pdf */}
      <Dialog
        visible={jsPdfPreviewOpen}
        onHide={() => setJsPdfPreviewOpen(false)}
        modal
        style={{ width: '90vw', height: '90vh' }}
        header="Preview PDF"
      >
        <PDFViewer
          pdfUrl={pdfUrl}
          fileName={fileName}
          paperSize={selectedRow?.paperSize || 'A4'}
          idRiwayat={selectedRow?.IDRIWAYATINAP}
        />
      </Dialog>
    </>
  )
}

export default TabelRiwayatInap
