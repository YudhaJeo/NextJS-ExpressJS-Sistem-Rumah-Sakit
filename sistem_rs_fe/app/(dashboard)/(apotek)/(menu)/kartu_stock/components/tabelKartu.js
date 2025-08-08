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

const TabelKartu = ({ data, loading, onDetail }) => {
  const [adjustDialog, setAdjustDialog] = useState(false)
  const [jsPdfPreviewOpen, setJsPdfPreviewOpen] = useState(false)
  const [pdfUrl, setPdfUrl] = useState('')
  const [fileName, setFileName] = useState('')
  const [selectedRow, setSelectedRow] = useState(null)

  const PDFViewer = dynamic(() => import('./PDFViewer'), { ssr: false })

  const handleOpenAdjust = async (rowData) => {
    try {
      const res = await axios.get(`${API_URL}/pemesanan/${rowData.IDPEMESANAN}`)
      const detail = res.data

      setSelectedRow(detail)
      setAdjustDialog(true)
    } catch (err) {
      console.error('Gagal ambil detail:', err)
      alert('Gagal mengambil detail:')
    }
  }

  const actionBody = (rowData) => (
    <div className="flex gap-2 justify-center">
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
        <Column field="IDPEMESANAN" header="ID" />
      <Column field="TGLPEMESANAN" header="Tanggal" />
      <Column field="NAMASUPPLIER" header="Supplier" />
      <Column field="STATUS" header="Status" />
      <Column
        header="Detail"
        body={(row) => (
          <div className="flex gap-2">
            <Button
              label="Detail"
              icon="pi pi-search"
              size="small"
              onClick={() => onDetail(row)}
            />
          </div>
        )}
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

export default TabelKartu
