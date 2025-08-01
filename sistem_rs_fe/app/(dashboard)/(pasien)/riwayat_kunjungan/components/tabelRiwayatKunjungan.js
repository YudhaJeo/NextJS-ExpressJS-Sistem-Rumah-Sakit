"use client";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import dynamic from "next/dynamic";
import AdjustPrintMarginLaporan from "./adjustPrintMarginLaporan";
import { useState } from "react";

const PDFViewer = dynamic(() => import("./PDFViewer"), { ssr: false });

const TabelRiwayatKunjungan = ({ data, loading }) => {
  const [adjustDialog, setAdjustDialog] = useState(false);
  const [jsPdfPreviewOpen, setJsPdfPreviewOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    const tgl = new Date(tanggal);
    return tgl.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleOpenAdjust = (rowData) => {
    setSelectedRow(rowData);
    setAdjustDialog(true);
  };

  const fotoBodyTemplate = (rowData) => {
    if (!rowData.FOTOPROFIL) return <span className="text-gray-400">Belum ada foto</span>;
    const src = `http://localhost:4000/uploads/riwayat_pengobatan/${rowData.FOTOPROFIL}`;
    return <img src={src} alt="foto" width="80" className="rounded-md" />;
  };

  const actionBody = (rowData) => (
    <div className="flex gap-2 justify-center">
      <a
        href={`/riwayat_kunjungan/${rowData.IDPENDAFTARAN}`}
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
  );

  return (
    <>
      <DataTable
        value={data}
        paginator
        rows={10}
        loading={loading}
        stripedRows
        responsiveLayout="scroll"
      >
        <Column field="NAMALENGKAP" header="Nama Pasien" />
        <Column field="NIK" header="NIK" />
        <Column
          field="TANGGALKUNJUNGAN"
          header="Tgl Kunjungan"
          body={(row) => formatTanggal(row.TANGGALKUNJUNGAN)}
        />
        <Column field="KELUHAN" header="Keluhan" />
        <Column field="POLI" header="Poli" />
        <Column
          field="STATUSKUNJUNGAN"
          header="Status Kunjungan"
          body={(row) => (
            <Tag
              value={row.STATUSKUNJUNGAN}
              severity={row.STATUSKUNJUNGAN === "Selesai" ? "success" : "warning"}
            />
          )}
        />
        <Column field="STATUSRAWAT" header="Status Rawat" />
        <Column field="NAMADOKTER" header="Dokter" />
        <Column field="DIAGNOSA" header="Diagnosa" />
        <Column field="OBAT" header="Obat" />
        <Column
          header="Aksi"
          body={actionBody}
          style={{ width: "150px", textAlign: "center" }}
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
        style={{ width: "90vw", height: "90vh" }}
        header="Preview PDF"
      >
        <PDFViewer pdfUrl={pdfUrl} fileName={fileName} paperSize={"A4"} />
      </Dialog>
    </>
  );
};

export default TabelRiwayatKunjungan;