"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import HeaderBar from "@/app/components/headerbar";
import TabelTenagaNonMedis from "./components/tabelTenagaNonMedis";
import FormDialogTenagaNonMedis from "./components/formDialogTenagaNonMedis";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const toastRef = useRef(null);
  const router = useRouter();

  const [form, setForm] = useState({
    IDTENAGANONMEDIS: 0,
    KODETENAGANONMEDIS: "",
    NAMALENGKAP: "",
    JENISKELAMIN: "",
    TEMPATLAHIR: "",
    TANGGALLAHIR: null,
    NOHP: "",
    EMAIL: "",
    PASSWORD: "",
    JENISTENAGANONMEDIS: "",
    SPESIALISASI: "",
    UNITKERJA: "",
    STATUSKEPEGAWAIAN: "Tetap",
    FOTOPROFIL: undefined,
    DOKUMENPENDUKUNG: undefined,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/tenaga_non_medis`);
      setData(res.data.data);
      setOriginalData(res.data.data);
    } catch (err) {
      console.error("Gagal mengambil data tenaga non medis:", err);
    }
  };

  const showToast = (severity, summary, detail) => {
    toastRef.current?.show({ severity, summary, detail, life: 3000 });
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      for (const key in form) {
        if (key === "FOTOPROFIL" || key === "DOKUMENPENDUKUNG") continue;

        if (key === "PASSWORD") {
          if (form.IDTENAGANONMEDIS === 0 || form.PASSWORD.trim()) {
            formData.append("PASSWORD", form.PASSWORD);
          }
          continue;
        }

        if (form[key] !== undefined && form[key] !== null) {
          if (["TANGGALLAHIR"].includes(key) && form[key]) {
            formData.append(key, new Date(form[key]).toISOString());
          } else {
            formData.append(key, form[key]);
          }
        }
      }

      if (form.FOTOPROFIL instanceof File) {
        formData.append("FOTOPROFIL", form.FOTOPROFIL);
      }
      if (form.DOKUMENPENDUKUNG instanceof File) {
        formData.append("DOKUMENPENDUKUNG", form.DOKUMENPENDUKUNG);
      }

      if (form.IDTENAGANONMEDIS) {
        await axios.put(`${API_URL}/tenaga_non_medis/${form.IDTENAGANONMEDIS}`, formData);
        showToast("success", "Berhasil", "Data berhasil diperbarui");
      } else {
        await axios.post(`${API_URL}/tenaga_non_medis`, formData);
        showToast("success", "Berhasil", "Data berhasil ditambahkan");
      }

      fetchData();
      setDialogVisible(false);
      resetForm();
    } catch (err) {
      console.error("Gagal menyimpan data:", err);
      showToast("error", "Gagal", "Terjadi kesalahan saat menyimpan data");
    }
  };

  const handleEdit = (row) => {
    setForm({
      ...row,
      TANGGALLAHIR: row.TANGGALLAHIR ? new Date(row.TANGGALLAHIR) : null,
      FOTOPROFIL: undefined,
      DOKUMENPENDUKUNG: undefined,
      PASSWORD: "",
    });
    setDialogVisible(true);
  };

  const confirmDelete = (row) => {
    confirmDialog({
      message: `Apakah yakin ingin menghapus '${row.NAMALENGKAP}'?`,
      header: "Konfirmasi Hapus",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Ya",
      rejectLabel: "Batal",
      accept: () => handleDelete(row),
    });
  };

  const handleDelete = async (row) => {
    try {
      await axios.delete(`${API_URL}/tenaga_non_medis/${row.IDTENAGANONMEDIS}`);
      fetchData();
      showToast("success", "Berhasil", "Data berhasil dihapus");
    } catch (err) {
      console.error("Gagal menghapus:", err);
      showToast("error", "Gagal", "Terjadi kesalahan saat menghapus data");
    }
  };

  const handleSearch = (keyword) => {
    const query = keyword.toLowerCase();
    if (!query.trim()) {
      setData(originalData);
      return;
    }

    const filtered = originalData.filter((item) => {
      const kode = item.KODETENAGANONMEDIS?.toLowerCase() || "";
      const nama = item.NAMALENGKAP?.toLowerCase() || "";
      return kode.includes(query) || nama.includes(query);
    });

    setData(filtered);
  };

  const resetForm = () => {
    setForm({
      IDTENAGANONMEDIS: 0,
      KODETENAGANONMEDIS: "",
      NAMALENGKAP: "",
      JENISKELAMIN: "",
      TEMPATLAHIR: "",
      TANGGALLAHIR: null,
      NOHP: "",
      EMAIL: "",
      PASSWORD: "",
      JENISTENAGANONMEDIS: "",
      SPESIALISASI: "",
      UNITKERJA: "",
      STATUSKEPEGAWAIAN: "Tetap",
      FOTOPROFIL: undefined,
      DOKUMENPENDUKUNG: undefined,
    });
    setErrors({});
  };

  const inputClass = (field) =>
    errors[field] ? "p-invalid w-full mt-2" : "w-full mt-2";

  return (
    <div className="card">
      <Toast ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold">Master Data Tenaga Non Medis</h3>

      <HeaderBar
        title=""
        placeholder="Cari kode atau nama..."
        onSearch={handleSearch}
        onAddClick={() => setDialogVisible(true)}
      />

      <TabelTenagaNonMedis
        data={data}
        loading={false}
        onEdit={handleEdit}
        onDelete={confirmDelete}
      />

      <FormDialogTenagaNonMedis
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
        }}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        inputClass={inputClass}
      />
    </div>
  );
};

export default Page;