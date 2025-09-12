'use client'

import React, { useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Tag } from "primereact/tag";
import dynamic from 'next/dynamic'
import axios from 'axios'
import AdjustPrintMarginLaporan from './adjustPrintMarginLaporan'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const TabelLaporanKomisi = ({ data, loading }) => {
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
      const res = await axios.get(`${API_URL}/komisi_dokter/${rowData.IDKOMISI}`)
      const detail = res.data

      setSelectedRow(detail)
      setAdjustDialog(true)
    } catch (err) {
      console.error('Gagal ambil detail:', err)
      alert('Gagal mengambil detail laporan komisi')
    }
  }

  const actionBody = (rowData) => (
    <div className="flex gap-2 justify-center">
      <a
        href={`/dokter/menu/laporan/laporan_komisi/${rowData.IDKOMISI}`}
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
      <DataTable value={data} paginator rows={10} loading={loading} size="small" scrollable>
        <Column field="NAMADOKTER" header="Dokter" />
        <Column field="NAMAPASIEN" header="Pasien" />
        <Column field="TANGGALKUNJUNGAN" header="Total Tagihan" body={(r) => formatTanggal(r.TANGGALKUNJUNGAN)} />
        <Column field="NILAIKOMISI" header="Komisi" body={(r) => formatRupiah(r.NILAIKOMISI)} />
        <Column
          header="Status"
          body={(row) => {
            const status = row.STATUS;
            const severity = () => {
              switch (status) {
                case "Sudah Bayar":
                  return "success";
                default:
                  return "info";
              }
            };

            return <Tag value={status} severity={severity()} />;
          }}
        />
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

export default TabelLaporanKomisi
