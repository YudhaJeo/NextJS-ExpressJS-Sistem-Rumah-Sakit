'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import AdjustPrintMarginLaporan from './adjustPrintMarginLaporan';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const asuransiSeverity = {
  UMUM: 'info',
  BPJS: 'success',
  DEFAULT: 'warning'
};

const metodeSeverity = {
  'Cash': 'success',
  'Transfer Bank': 'info',
  'QRIS': 'warning',
  DEFAULT: 'secondary',
};

const TabelPembayaran = ({ data, loading, onEdit, onDelete }) => {
  const [adjustDialog, setAdjustDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [jsPdfPreviewOpen, setJsPdfPreviewOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [fileName, setFileName] = useState('');

  const PDFViewer = dynamic(() => import('./PDFViewer'), { ssr: false });

  const handleOpenAdjust = async (rowData) => {
    try {
      const res = await axios.get(`${API_URL}/pembayaran/${rowData.IDPEMBAYARAN}`);
      const detail = res.data.data;

      setSelectedRow(detail);
      setAdjustDialog(true);
    } catch (err) {
      console.error('Gagal ambil detail:', err);
      alert('Gagal mengambil detail pembayaran');
    }
  };

  const tanggalBodyTemplate = (row) => {
    const tgl = new Date(row.TANGGALBAYAR);
    return tgl.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const jumlahBodyTemplate = (row) => {
    return `Rp ${Number(row.JUMLAHBAYAR).toLocaleString('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const keteranganBodyTemplate = (row) => {
    return row.KETERANGAN && row.KETERANGAN.trim() !== '' ? row.KETERANGAN : '-';
  };

  const metodeBodyTemplate = (row) => (
    <Tag
      value={row.METODEPEMBAYARAN}
      severity={metodeSeverity[row.METODEPEMBAYARAN] || metodeSeverity.DEFAULT}
    />
  );

  const bankBodyTemplate = (row) => {
    return row.NAMA_BANK && row.NAMA_BANK.trim() !== '' ? row.NAMA_BANK : '-';
  };

  const asuransiBodyTemplate = (row) => {
    const severity =
      asuransiSeverity[row.ASURANSI?.toUpperCase()] || asuransiSeverity.DEFAULT;

    return (
      <Tag
        value={row.ASURANSI}
        severity={severity}
      />
    );
  };

  const actionBody = (row) => (
    <div className="flex gap-2">
      <a
        href={`/kasir/menu/invoice_pembayaran/pembayaran/${row.IDPEMBAYARAN}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button icon="pi pi-eye" className="p-button-sm"/>
      </a>
      <Button
        icon="pi pi-sliders-h"
        className="p-button-sm p-button-warning"
        onClick={() => handleOpenAdjust(row)}
      />
      <Button
        icon="pi pi-pencil"
        size="small"
        severity="warning"
        onClick={() => onEdit(row)}
      />
      <Button
        icon="pi pi-trash"
        size="small"
        severity="danger"
        onClick={() => onDelete(row)}
      />
    </div>
  );

  return (
    <>
      <DataTable
        value={data}
        paginator
        rows={10} rowsPerPageOptions={[10, 25, 50, 75, 100, 250, 500, 1000]}
        loading={loading}
        size="small"
        scrollable
      >
        <Column field="NOPEMBAYARAN" header="No Pembayaran" />
        <Column field="NOINVOICE" header="No Invoice" />
        <Column field="NIK" header="NIK" />
        <Column field="NAMAPASIEN" header="Nama Pasien" />
        <Column field="ASURANSI" header="Asuransi" body={asuransiBodyTemplate} />
        <Column field="METODEPEMBAYARAN" header="Metode" body={metodeBodyTemplate} />
        <Column field="NAMA_BANK" header="Bank" body={bankBodyTemplate} />
        <Column field="JUMLAHBAYAR" header="Jumlah Bayar" body={jumlahBodyTemplate} />
        <Column field="TANGGALBAYAR" header="Tanggal Bayar" body={tanggalBodyTemplate} />
        <Column field="KETERANGAN" header="Keterangan" body={keteranganBodyTemplate} />
        <Column header="Aksi" body={actionBody} />
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
  );
};

export default TabelPembayaran;