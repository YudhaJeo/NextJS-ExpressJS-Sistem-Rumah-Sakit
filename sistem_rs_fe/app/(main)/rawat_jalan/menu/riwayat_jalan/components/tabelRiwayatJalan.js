'use client'

import React, { useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Tag } from "primereact/tag";
import dynamic from 'next/dynamic'
import AdjustPrintMarginLaporan from './adjustPrintMarginLaporan'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const TabelRiwayatJalan = ({ data, loading, rajalOptions }) => {
  const [adjustDialog, setAdjustDialog] = useState(false)
  const [jsPdfPreviewOpen, setJsPdfPreviewOpen] = useState(false)
  const [pdfUrl, setPdfUrl] = useState('')
  const [fileName, setFileName] = useState('')
  const [selectedRow, setSelectedRow] = useState(null)

  const PDFViewer = dynamic(() => import('./PDFViewer'), { ssr: false })

  const formatTanggal = (tanggal) => {
    if (!tanggal) return '-'
    const tgl = new Date(tanggal)
    return tgl.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatRupiah = (value) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value || 0)

  const handleOpenAdjust = async (rowData) => {
    try {
      const res = await axios.get(`${API_URL}/riwayat_jalan/${rowData.IDRIWAYATJALAN}`)
      setSelectedRow(res.data.data)
      setAdjustDialog(true)
    } catch (err) {
      console.error('Gagal ambil detail:', err)
      alert('Gagal mengambil detail riwayat rawat jalan')
    }
  }

  const actionBody = (rowData) => (
    <div className="flex gap-2 justify-center">
      <a
        href={`/rawat_jalan/menu/riwayat_jalan/${rowData.IDRIWAYATJALAN}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button icon="pi pi-eye" className="p-button-sm" tooltip="Lihat Detail" />
      </a>
      <Button
        icon="pi pi-sliders-h"
        className="p-button-sm p-button-warning"
        onClick={() => handleOpenAdjust(rowData)}
        tooltip="Atur Margin & Cetak"
      />
    </div>
  )

  return (
    <>
      <DataTable value={data} paginator rows={10} loading={loading} size="small" scrollable>
        <Column field="NAMALENGKAP" header="Pasien" />
        <Column field="NAMADOKTER" header="Dokter" />
        <Column field="DIAGNOSA" header="Hasil Diagnosa" />
        <Column field="TOTALTINDAKAN" header="Total Tindakan" body={(r) => (r.TOTALTINDAKAN)} />
        <Column field="TOTALBIAYA" header="Tagihan Total" body={(r) => formatRupiah(r.TOTALBIAYA)} />
        <Column
  header="Status Rawat"
  body={(row) => {
    const status = row.STATUSRAWAT;

    const severity = () => {
      switch (status) {
        case "Rawat Jalan":
          return "info";   // biru
        case "Rawat Inap":
          return "success"; // hijau
        default:
          return "warning";
      }
    };

    return <Tag value={status} severity={severity()} />;
  }}
/>

        <Column field="TANGGALRAWAT" header="Tanggal Rawat" body={(r) => formatTanggal(r.TANGGALRAWAT)} />
        <Column header="Aksi" body={actionBody} style={{ width: '150px', textAlign: 'center' }} />
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

export default TabelRiwayatJalan