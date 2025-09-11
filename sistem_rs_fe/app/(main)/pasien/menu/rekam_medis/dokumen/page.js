"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import HeaderBar from "@/app/components/headerbar";
import TabelDokumen from "./components/tabelDokumen";
import FormDialogDokumen from "./components/formDialogDokumen";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const JenisDokumenOptions = [
  { label: "Hasil Lab", value: "Hasil Lab" },
  { label: "Resume Medis", value: "Resume Medis" },
  { label: "Rekam Rawat Jalan", value: "Rekam Rawat Jalan" },
];

export default function Page() {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [form, setForm] = useState({
    IDDOKUMEN: 0,
    NAMALENGKAP: "",
    NIK: "",
    JENISDOKUMEN: "",
    NAMAFILE: "",
    LOKASIFILE: "",
    TANGGALUPLOAD: new Date().toISOString(),
    file: undefined,
  });

  const [pasienOptions, setPasienOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const toastRef = useRef(null);

  useEffect(() => {
    fetchData();
    fetchPasien();
  }, []);

  const fetchPasien = async () => {
    try {
      const res = await axios.get(`${API_URL}/pasien`);
      const options = res.data.data.map((pasien) => ({
        label: `${pasien.NIK} - ${pasien.NAMALENGKAP}`,
        value: pasien.NIK,
        NAMALENGKAP: pasien.NAMALENGKAP,
      }));
      setPasienOptions(options);
    } catch (err) {
      console.error("Gagal ambil data pasien:", err);
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/dokumen`);
      setData(res.data.data);
      setOriginalData(res.data.data);
    } catch (err) {
      console.error("Gagal mengambil data dokumen:", err);
    }
  };

  const showToast = (severity, summary, detail) => {
    toastRef.current?.show({ severity, summary, detail, life: 3000 });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.NIK.trim()) newErrors.NIK = "NIK wajib diisi";
    else if (!/^\d{16}$/.test(form.NIK))
      newErrors.NIK = "NIK harus 16 digit angka";
    if (!form.JENISDOKUMEN)
      newErrors.JENISDOKUMEN = "Jenis dokumen wajib dipilih";
    if (!form.file && !form.IDDOKUMEN)
      newErrors.file = "File wajib diunggah";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append("NIK", form.NIK);
      formData.append("JENISDOKUMEN", form.JENISDOKUMEN || "");
      if (form.file) {
        formData.append("file", form.file);
      }

      if (form.IDDOKUMEN) {
        await axios.put(`${API_URL}/dokumen/${form.IDDOKUMEN}`, formData);
        showToast("success", "Berhasil", "Dokumen berhasil diperbarui");
      } else {
        await axios.post(`${API_URL}/dokumen`, formData);
        showToast("success", "Berhasil", "Dokumen berhasil ditambahkan");
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
      const nik = item.NIK?.toLowerCase() || "";
      const nama = item.NAMALENGKAP?.toLowerCase() || "";
      return nik.includes(query) || nama.includes(query);
    });
    setData(filtered);
  };

  const handleEdit = (row) => {
    setForm({
      IDDOKUMEN: row.IDDOKUMEN,
      NAMALENGKAP: row.NAMALENGKAP,
      NIK: row.NIK,
      JENISDOKUMEN: row.JENISDOKUMEN || "",
      NAMAFILE: row.NAMAFILE || "",
      LOKASIFILE: row.LOKASIFILE || "",
      TANGGALUPLOAD: row.TANGGALUPLOAD,
      file: undefined,
    });
    setDialogVisible(true);
  };

  const confirmDelete = (row) => {
    confirmDialog({
      message: `Apakah yakin ingin menghapus dokumen milik '${row.NAMALENGKAP}'?`,
      header: "Konfirmasi Hapus",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Ya",
      rejectLabel: "Batal",
      accept: () => handleDelete(row),
    });
  };

  const handleDelete = async (row) => {
    try {
      await axios.delete(`${API_URL}/dokumen/${row.IDDOKUMEN}`);
      fetchData();
      showToast("success", "Berhasil", "Data dokumen berhasil dihapus");
    } catch (err) {
      console.error("Gagal menghapus dokumen:", err);
      showToast("error", "Gagal", "Gagal menghapus data dokumen");
    }
  };

  const handleDownload = async (row) => {
    try {
      const response = await axios.get(
        `${API_URL}/dokumen/download-by-id/${row.IDDOKUMEN}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", row.NAMAFILE);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Gagal mengunduh file:", error);
      showToast("error", "Gagal Download", "Tidak dapat mengunduh file.");
    }
  };

  const resetForm = () => {
    setForm({
      IDDOKUMEN: 0,
      NAMALENGKAP: "",
      NIK: "",
      JENISDOKUMEN: "",
      NAMAFILE: "",
      LOKASIFILE: "",
      TANGGALUPLOAD: new Date().toISOString(),
      file: undefined,
    });
    setErrors({});
  };

  const inputClass = (field) =>
    errors[field] ? "p-invalid w-full mt-2" : "w-full mt-2";

  return (
    <div className="card">
      <Toast ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold">Manajemen Dokumen Rekam Medis</h3>

      <HeaderBar
        title=""
        placeholder="Cari nama atau NIK..."
        onSearch={handleSearch}
        onAddClick={() => setDialogVisible(true)}
      />

      <TabelDokumen
        data={data}
        onEdit={handleEdit}
        onDelete={confirmDelete}
        loading={false}
        onDownload={handleDownload}
      />

      <FormDialogDokumen
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
        }}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        pasienOptions={pasienOptions}
        errors={errors}
        inputClass={inputClass}
        JenisDokumenOptions={JenisDokumenOptions}
      />
    </div>
  );
}