'use client'

import React, { useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import dynamic from 'next/dynamic'
import AdjustPrintMarginLaporan from './adjustPrintMarginLaporan'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const TabelRiwayatInap = ({ data, loading }) => {
  const [adjustDialog, setAdjustDialog] = useState(false)
  const [jsPdfPreviewOpen, setJsPdfPreviewOpen] = useState(false)
  const [pdfUrl, setPdfUrl] = useState('')
  const [fileName, setFileName] = useState('')
  const [selectedRow, setSelectedRow] = useState(null)

  const PDFViewer = dynamic(() => import('./PDFViewer'), { ssr: false })

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

  const handleOpenAdjust = async (rowData) => {
    try {
      const res = await axios.get(`${API_URL}/riwayat_inap/${rowData.IDRIWAYATINAP}`)
      const detail = res.data.data

      setSelectedRow(detail)
      setAdjustDialog(true)
    } catch (err) {
      console.error('Gagal ambil detail:', err)
      alert('Gagal mengambil detail rawat inap')
    }
  }

  const actionBody = (rowData) => (
    <div className="flex gap-2 justify-center">
      <a
        href={`/rawat_inap/menu/riwayat_inap/${rowData.IDRIWAYATINAP}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button icon="pi pi-eye" className="p-button-sm" tooltip="Lihat Detail" />
      </a>
      <Button
        icon="pi pi-sliders-h"
        className="p-button-sm p-button-warning"
        onClick={() => handleOpenAdjust(rowData)}
        tooltip="Atur Margin"
      />
    </div>
  )

  return (
    <>
      <DataTable value={data} paginator rows={10} loading={loading} size="small" sortField="TANGGALMASUK" sortOrder={-1}>
        <Column
          field="NAMALENGKAP"
          header="Pasien"
        />
        <Column
          field="NOMORBED"
          header="Bed"
        />
        <Column
          field="TOTALOBAT"
          header="Total Obat"
          body={(r) => formatRupiah(r.TOTALOBAT)}
        />
        <Column
          field="TOTALALKES"
          header="Total Alkes"
          body={(r) => formatRupiah(r.TOTALALKES)}
        />
        <Column
          field="TOTALTINDAKAN"
          header="Total Tindakan"
          body={(r) => formatRupiah(r.TOTALTINDAKAN)}
        />
        <Column
          field="TOTALKAMAR"
          header="Total Kamar"
          body={(r) => formatRupiah(r.TOTALKAMAR)}
        />
        <Column
          field="TOTALBIAYA"
          header="Tagihan Total"
          body={(r) => formatRupiah(r.TOTALBIAYA)}
        />
        <Column
          field="TANGGALMASUK"
          header="Tanggal Masuk"
          body={(r) => formatTanggal(r.TANGGALMASUK)}
        />
        <Column
          field="TANGGALKELUAR"
          header="Tanggal Keluar"
          body={(r) => formatTanggal(r.TANGGALKELUAR)}
        />
        <Column
          header="Aksi"
          body={actionBody}
          style={{ width: '150px', textAlign: 'center' }}
        />
      </DataTable>

      <AdjustPrintMarginLaporan
        adjustDialog={adjustDialog}
        setAdjustDialog={setAdjustDialog}
        selectedRow={selectedRow}
        setPdfUrl={setPdfUrl}
        setFileName={setFileName}
        setJsPdfPreviewOpen={setJsPdfPreviewOpen}
      />

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
        />
      </Dialog>
    </>
  )
}

export default TabelRiwayatInap
