'use client'

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { ProgressSpinner } from 'primereact/progressspinner'
import AdjustPrintMarginLaporan from '../components/adjustPrintMarginLaporan'

const PDFViewer = dynamic(
  () => import('../components/PDFViewer'),
  { ssr: false } 
)

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DetailRiwayatKunjungan() {
  const { nik } = useParams()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [adjustDialog, setAdjustDialog] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)
  const [pdfUrl, setPdfUrl] = useState(null)
  const [fileName, setFileName] = useState('')
  const [jsPdfPreviewOpen, setJsPdfPreviewOpen] = useState(false)

  useEffect(() => {
    if (nik) fetchDetail()
  }, [nik])

  const fetchDetail = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get(`${API_URL}/riwayat_kunjungan/detail/${nik}`)
      setData(res.data.data || []);
    } catch (err) {
      console.error('Gagal fetch detail riwayat kunjungan:', err)
      setError('Gagal memuat detail riwayat kunjungan.')
    } finally {
      setLoading(false)
    }
  }

  const formatTanggal = (tanggal) => {
    if (!tanggal) return '-'
    return new Date(tanggal).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }
  
const handleOpenAdjust = async (row) => {
  try {
    let res;
    if (row.JENIS === 'RAWAT JALAN') {
      res = await axios.get(`${API_URL}/riwayat_jalan/${row.IDRIWAYATJALAN}`);
    } else if (row.JENIS === 'RAWAT INAP') {
      res = await axios.get(`${API_URL}/riwayat_inap/${row.IDRIWAYATINAP}`);
    }

    if (res?.data?.data) {
      setSelectedRow({ ...res.data.data, JENIS: row.JENIS });
      setAdjustDialog(true);
    } else {
      alert('Data detail tidak ditemukan');
    }
  } catch (err) {
    console.error('Gagal ambil detail:', err);
    alert('Gagal mengambil detail riwayat');
  }
};

  const handleDetail = (row) => {
    if (row.JENIS === 'RAWAT JALAN') {
      window.open(`/rawat_jalan/menu/riwayat_jalan/${row.IDRIWAYATJALAN}`, "_blank")
    } else if (row.JENIS === 'RAWAT INAP') {
      window.open(`/rawat_inap/menu/riwayat_inap/${row.IDRIWAYATINAP}`, "_blank")
    }
  }

  const actionBody = (row) => (
    <div className="flex gap-2 justify-center">
      <Button
        icon="pi pi-eye"
        className="p-button-sm p-button-info"
        label="Detail"
        onClick={() => handleDetail(row)}
      />
      <Button
        icon="pi pi-sliders-h"
        className="p-button-sm p-button-warning"
        onClick={() => handleOpenAdjust(row)}
        tooltip="Atur Margin & Cetak"
      />
    </div>
  )

  return (
    <div className="card">
      <h3 className="mb-3">Detail Riwayat Kunjungan Pasien</h3>

      {loading && (
        <div className="flex justify-center p-5">
          <ProgressSpinner />
        </div>
      )}

      {error && <div className="text-red-500 text-center p-3">{error}</div>}

      {!loading && !error && (
        <DataTable
          value={data}
          stripedRows
          paginator
          rows={10} rowsPerPageOptions={[10, 25, 50, 75, 100, 250, 500, 1000]}
          emptyMessage="Belum ada riwayat untuk pasien ini."
        >
          <Column field="JENIS" header="Jenis" />
          <Column
            field="TANGGAL"
            header="Tanggal"
            body={(row) => formatTanggal(row.TANGGAL)}
          />
          <Column
            header="Aksi"
            body={actionBody}
            style={{ width: '180px', textAlign: 'center' }}
          />
        </DataTable>
      )}

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
    </div>
  )
}