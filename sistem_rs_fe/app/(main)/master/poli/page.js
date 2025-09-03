"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import TabelPoli from "./components/tabelPoli";
import FormPoli from "./components/formDialogPoli";
import HeaderBar from "@/app/components/headerbar";
import ToastNotifier from "@/app/components/toastNotifier";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import AdjustPrintMarginLaporan from "./adjustPrintMarginLaporan";
import { Dialog } from "primereact/dialog";
import dynamic from "next/dynamic";
import { Button } from "primereact/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const PoliPage = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const PDFViewer = dynamic(() => import("./PDFViewer"), { ssr: false });
  const [adjustDialog, setAdjustDialog] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [jsPdfPreviewOpen, setJsPdfPreviewOpen] = useState(false);

  const [formData, setFormData] = useState({
    IDPOLI: 0,
    NAMAPOLI: "",
    KODE: "",
    ZONA: "",
  });

  const [errors, setErrors] = useState({});

  const toastRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    fetchPoli();
  }, []);

  const fetchPoli = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/poli`);
      setData(res.data);
      setOriginalData(res.data);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.NAMAPOLI?.trim())
      newErrors.NAMAPOLI = "Nama Poli wajib diisi";
    if (!formData.KODE?.trim()) newErrors.KODE = "Kode wajib diisi";
    if (!formData.ZONA?.trim()) newErrors.ZONA = "Zona wajib diisi";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = (keyword) => {
    if (!keyword) {
      setData(originalData);
    } else {
      const filtered = originalData.filter(
        (item) =>
          item.NAMAPOLI.toLowerCase().includes(keyword.toLowerCase()) ||
          item.KODE.toLowerCase().includes(keyword.toLowerCase()) ||
          item.ZONA.toLowerCase().includes(keyword.toLowerCase())
      );
      setData(filtered);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const isEdit = !!formData.IDPOLI;
    const url = isEdit
      ? `${API_URL}/poli/${formData.IDPOLI}`
      : `${API_URL}/poli`;

    try {
      if (isEdit) {
        await axios.put(url, formData);
        toastRef.current?.showToast("00", "Data berhasil diperbarui");
      } else {
        await axios.post(url, formData);
        toastRef.current?.showToast("00", "Data berhasil ditambahkan");
      }
      fetchPoli();
      setDialogVisible(false);
      resetForm();
    } catch (err) {
      console.error("Gagal menyimpan data:", err);
      toastRef.current?.showToast("01", "Gagal menyimpan data");
    }
  };

  const handleEdit = (row) => {
    setFormData({ ...row });
    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    confirmDialog({
      message: `Apakah Anda yakin ingin menghapus Poli ${row.NAMAPOLI}?`,
      header: "Konfirmasi Hapus",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Ya",
      rejectLabel: "Batal",
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/poli/${row.IDPOLI}`);
          fetchPoli();
          toastRef.current?.showToast("00", "Data berhasil dihapus");
        } catch (err) {
          console.error("Gagal menghapus data:", err);
          toastRef.current?.showToast("01", "Gagal menghapus data");
        }
      },
    });
  };

  const resetForm = () => {
    setFormData({
      IDPOLI: 0,
      NAMAPOLI: "",
      KODE: "",
      ZONA: "",
    });
    setErrors({});
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Master Poli</h3>

      <div className="flex items-center justify-end">
        <Button
          icon="pi pi-print"
          className="p-button-warning mt-3"
          tooltip="Atur Print Margin"
          onClick={() => setAdjustDialog(true)}
        />
        <HeaderBar
          title=""
          placeholder="Cari Nama Poli atau Kode"
          onSearch={handleSearch}
          onAddClick={() => {
            resetForm();
            setDialogVisible(true);
          }}
        />
      </div>

      <TabelPoli
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormPoli
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
        }}
        onChange={setFormData}
        onSubmit={handleSubmit}
        formData={formData}
        errors={errors}
      />

      <AdjustPrintMarginLaporan
        adjustDialog={adjustDialog}
        setAdjustDialog={setAdjustDialog}
        selectedRow={null}
        dataPoli={data}
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
};

export default PoliPage;