"use client";

import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import dynamic from "next/dynamic";
// import AdjustPrintMarginLaporan from "./adjustPrintMarginLaporan";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const TabelRiwayatKunjungan = ({ data, loading }) => {
  const [adjustDialog, setAdjustDialog] = useState(false);
  const [jsPdfPreviewOpen, setJsPdfPreviewOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);

  const PDFViewer = dynamic(() => import("./PDFViewer"), { ssr: false });

  // Format tanggal sederhana
  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    const tgl = new Date(tanggal);
    return tgl.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Ambil detail kunjungan untuk cetak
  const handleOpenAdjust = async (rowData) => {
    try {
      const res = await axios.get(`${API_URL}/riwayat_kunjungan/${rowData.NIK}`);
      setSelectedRow(res.data.data); // isi semua riwayat pasien
      setAdjustDialog(true);
    } catch (err) {
      console.error("Gagal ambil detail:", err);
      alert("Gagal mengambil detail riwayat kunjungan");
    }
  };

  const actionBody = (rowData) => (
    <div className="flex gap-2 justify-center">
      <a
        href={`/riwayat_kunjungan/${rowData.NIK}`}
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
        onClick={() => handleOpenAdjust(rowData)}
        tooltip="Atur Margin & Cetak"
      />
    </div>
  );

  return (
    <>
      <DataTable
        value={data}
        paginator
        rows={10}
        loading={loading}
        stripedRows
        size="small"
        scrollable
        emptyMessage="Belum ada data riwayat kunjungan."
      >
        <Column field="NOREKAMMEDIS" header="No Rekam Medis" />
        <Column field="NIK" header="NIK" />
        <Column field="NAMALENGKAP" header="Nama Pasien" />
        <Column
          field="TANGGAL" 
          header="Terakhir Kunjungan"
          body={(r) => formatTanggal(r.TANGGAL)}
        />
        <Column
          header="Aksi"
          body={actionBody}
          style={{ width: "150px", textAlign: "center" }}
        />
      </DataTable>

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

export default TabelRiwayatKunjungan;