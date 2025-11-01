"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import HeaderBar from "@/app/components/headerbar";
import TabelBerita from "./components/tabelBerita";
import FormDialogBerita from "./components/formDialogBerita";
import { Button } from "primereact/button";
import AdjustPrintMarginLaporan from "./print/adjustPrintMarginLaporan";
import { Dialog } from "primereact/dialog";
import dynamic from "next/dynamic";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Page() {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [adjustDialog, setAdjustDialog] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [jsPdfPreviewOpen, setJsPdfPreviewOpen] = useState(false);
  const PDFViewer = dynamic(() => import("./print/PDFViewer"), { ssr: false });
  const [form, setForm] = useState({
    IDBERITA: 0,
    JUDUL: "",
    DESKRIPSISINGKAT: "",
    PRATINJAU: "",
    URL: "",
    PRATINJAU: undefined,
  });

  const [errors, setErrors] = useState({});
  const toastRef = useRef(null);

  const showToast = (severity, summary, detail) => {
    if (toastRef.current) {
      toastRef.current.show({ severity, summary, detail, life: 3000 });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/berita`);
      const sortedData = res.data.data.sort((a, b) => b.IDBERITA - a.IDBERITA);
      setData(sortedData);
      setOriginalData(sortedData);
    } catch (err) {
      console.error("Gagal mengambil data berita:", err);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.JUDUL.trim()) newErrors.JUDUL = "Judul berita wajib diisi";
    if (!form.DESKRIPSISINGKAT.trim()) newErrors.DESKRIPSISINGKAT = "Deskripsi singkat wajib diisi";
    if (!form.URL.trim()) newErrors.URL = "URL berita wajib diisi";

    if (!form.PRATINJAU && !form.IDBERITA)
      newErrors.PRATINJAU = "File wajib diunggah";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append("JUDUL", form.JUDUL || "");
      formData.append("DESKRIPSISINGKAT", form.DESKRIPSISINGKAT);
      if (form.PRATINJAU) {
        formData.append("file", form.PRATINJAU);
      }
      formData.append("URL", form.URL || "");

      if (form.IDBERITA) {
        await axios.put(`${API_URL}/berita/${form.IDBERITA}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("success", "Berhasil", "Berita berhasil diperbarui");
      } else {
        await axios.post(`${API_URL}/berita`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("success", "Berhasil", "Berita berhasil ditambahkan");
      }

      fetchData();
      setDialogVisible(false);
      resetForm();
    } catch (err) {
      console.error("Gagal menyimpan data:", err);
      showToast("error", "Gagal", "Terjadi kesalahan saat menyimpan data");
    }
  };

  const handleSearch = (keyword) => {
    const query = keyword.toLowerCase();
    if (!query.trim()) {
      setData(originalData);
      return;
    }
    const filtered = originalData.filter((item) => {
      const deskripsisingkat = item.DESKRIPSISINGKAT?.toLowerCase() || "";
      const judul = item.JUDUL?.toLowerCase() || "";
      return deskripsisingkat.includes(query) || judul.includes(query);
    });
    setData(filtered);
  };

  const handleEdit = (row) => {
    setForm({
      IDBERITA: row.IDBERITA,
      JUDUL: row.JUDUL,
      DESKRIPSISINGKAT: row.DESKRIPSISINGKAT,
      URL: row.URL,
      PRATINJAU: undefined,
    });
    setDialogVisible(true);
  };

  const confirmDelete = (row) => {
    confirmDialog({
      message: `Apakah yakin ingin menghapus berita'${row.JUDUL}'?`,
      header: "Konfirmasi Hapus",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Ya",
      rejectLabel: "Batal",
      accept: () => handleDelete(row),
    });
  };

  const handleDelete = async (row) => {
    try {
      await axios.delete(`${API_URL}/berita/${row.IDBERITA}`);
      fetchData();
      showToast("success", "Berhasil", "Data berita berhasil dihapus");
    } catch (err) {
      console.error("Gagal menghapus berita:", err);
      showToast("error", "Gagal", "Gagal menghapus data berita");
    }
  };

  const resetForm = () => {
    setForm({
      IDBERITA: 0,
      JUDUL: "",
      DESKRIPSISINGKAT: "",
      URL: "",
      PRATINJAU: undefined,
    });
    setErrors({});
  };

  const inputClass = (field) =>
    errors[field] ? "p-invalid w-full mt-2" : "w-full mt-2";

  return (
    <div className="card">
      <Toast ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold">Manajemen Berita</h3>
      <div className="flex items-center justify-end">
        <Button
          icon="pi pi-print"
          className="p-button-warning mt-3"
          tooltip="Cetak Data"
          onClick={() => setAdjustDialog(true)}
        />
        <HeaderBar
          title=""
          placeholder="Cari berita..."
          onSearch={handleSearch}
          onAddClick={() => setDialogVisible(true)}
        />
      </div>

      <TabelBerita
        data={data}
        onEdit={handleEdit}
        onDelete={confirmDelete}
        loading={false}
      />

      <FormDialogBerita
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
        }}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        errors={errors}
        inputClass={inputClass}
      />

      <AdjustPrintMarginLaporan
        adjustDialog={adjustDialog}
        setAdjustDialog={setAdjustDialog}
        selectedRow={null}
        dataBerita={data}
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