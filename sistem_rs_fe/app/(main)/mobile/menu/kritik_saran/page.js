"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import TabelKritikSaran from "./components/TabelKritikSaran";
import HeaderBar from "@/app/components/headerbar";
import { Button } from "primereact/button";
import AdjustPrintMarginLaporan from "./print/adjustPrintMarginLaporan";
import { Dialog } from "primereact/dialog";
import dynamic from "next/dynamic";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function PageKritikSaran() {
  const [data, setData] = useState([]);
  const [adjustDialog, setAdjustDialog] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [jsPdfPreviewOpen, setJsPdfPreviewOpen] = useState(false);
  const PDFViewer = dynamic(() => import("./print/PDFViewer"), { ssr: false });
  const toastRef = useRef(null);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/kritik_saran`);
      setData(res.data.data.sort((a, b) => b.IDKRITIKSARAN - a.IDKRITIKSARAN));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="card">
      <Toast ref={toastRef} />
      <ConfirmDialog />

      <div className="flex justify-between mb-3">
        <h3 className="text-xl font-semibold">Manajemen Kritik & Saran</h3>
      </div>

      <div className="flex items-center justify-end">
        <Button
          icon="pi pi-print"
          className="p-button-warning mt-3"
          tooltip="Cetak Data"
          onClick={() => setAdjustDialog(true)}
        />
        <HeaderBar
          title=""
          placeholder="Cari NIK"
          onSearch={(keyword) => {
            if (!keyword) return fetchData();
            const filtered = data.filter((item) =>
              item.NIK.toLowerCase().includes(keyword.toLowerCase())
            );
            setData(filtered);
          }}
        />
      </div>

      <TabelKritikSaran data={data} loading={false} />

      <AdjustPrintMarginLaporan
        adjustDialog={adjustDialog}
        setAdjustDialog={setAdjustDialog}
        selectedRow={null}
        dataKritikSaran={data}
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
        <PDFViewer pdfUrl={pdfUrl} fileName={fileName} paperSize="A4" />
      </Dialog>
    </div>
  );
}
