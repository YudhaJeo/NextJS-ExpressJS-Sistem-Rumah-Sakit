"use client";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import dynamic from "next/dynamic";
import AdjustPrintMarginLaporan from "./adjustPrintMarginLaporan";
import { useState } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const statusLabels = {
  BELUM_LUNAS: "Belum Dibayar",
  LUNAS: "Sudah Dibayar",
};

const statusSeverity = {
  BELUM_LUNAS: "danger",
  LUNAS: "success",
};

const TabelInvoice = ({ data, loading, onDelete }) => {
  const [adjustDialog, setAdjustDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [jsPdfPreviewOpen, setJsPdfPreviewOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [fileName, setFileName] = useState("");

  const PDFViewer = dynamic(() => import("./PDFViewer"), { ssr: false });

  const handleOpenAdjust = async (rowData) => {
    try {
      const res = await axios.get(`${API_URL}/invoice/${rowData.IDINVOICE}`);
      const detail = res.data.data;

      setSelectedRow(detail);
      setAdjustDialog(true);
    } catch (err) {
      console.error("Gagal ambil detail:", err);
      alert("Gagal mengambil detail invoice");
    }
  };

  const statusBody = (rowData) => (
    <Tag
      value={statusLabels[rowData.STATUS] || rowData.STATUS}
      severity={statusSeverity[rowData.STATUS] || "info"}
    />
  );

  const asuransiBody = (rowData) => {
    let severity = "warning"; 
    const asuransi = rowData.ASURANSI?.toUpperCase() || "";

    if (asuransi.includes("BPJS")) {
      severity = "success"; 
    } else if (asuransi === "UMUM") {
      severity = "info";
    }

    return <Tag value={rowData.ASURANSI} severity={severity} />;
  };

  const actionBody = (rowData) => (
    <div className="flex gap-2">
      {rowData.STATUS === "LUNAS" && (
        <Button
          icon="pi pi-sliders-h"
          className="p-button-sm p-button-warning"
          onClick={() => handleOpenAdjust(rowData)}
        />
      )}
      <a
        href={`/invoice/${rowData.IDINVOICE}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button icon="pi pi-eye" className="p-button-sm"/>
      </a>
      <Button
        icon="pi pi-trash"
        size="small"
        severity="danger"
        onClick={() => onDelete(rowData)}
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
        size="small"
        scrollable
      >
        <Column field="NOINVOICE" header="No Invoice" />
        <Column field="NIK" header="NIK" />
        <Column field="NAMAPASIEN" header="Nama Pasien" />
        <Column field="ASURANSI" header="Asuransi" body={asuransiBody} />
        <Column
          field="TANGGALINVOICE"
          header="Tgl Invoice"
          body={(rowData) => {
            const tgl = new Date(rowData.TANGGALINVOICE);
            return tgl.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });
          }}
        />
        <Column
          field="TOTALTAGIHAN"
          header="Total Tagihan"
          body={(rowData) =>
            `Rp ${Number(rowData.TOTALTAGIHAN).toLocaleString("id-ID")}`
          }
        />
        <Column
          field="TOTALDEPOSIT"
          header="Total Deposit"
          body={(rowData) =>
            `Rp ${Number(rowData.TOTALDEPOSIT).toLocaleString("id-ID")}`
          }
        />
        <Column
          field="TOTALANGSURAN"
          header="Total Angsuran"
          body={(rowData) =>
            `Rp ${Number(rowData.TOTALANGSURAN).toLocaleString("id-ID")}`
          }
        />
        <Column
          field="SISA_TAGIHAN"
          header="Sisa Tagihan"
          body={(rowData) =>
            `Rp ${Number(rowData.SISA_TAGIHAN || 0).toLocaleString("id-ID")}`
          }
        />
        <Column field="STATUS" header="Status" body={statusBody} />
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
        style={{ width: "90vw", height: "90vh" }}
        header="Preview PDF"
      >
        <PDFViewer
          pdfUrl={pdfUrl}
          fileName={fileName}
          paperSize={selectedRow?.paperSize || "A4"}
        />
      </Dialog>
    </>
  );
};

export default TabelInvoice;