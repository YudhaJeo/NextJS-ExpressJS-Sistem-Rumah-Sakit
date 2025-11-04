"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import HeaderBar from "@/app/components/headerbar";
import TabelProfile from "./components/tabelProfile";
import FormDialogProfile from "./components/formDialogProfile";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Page() {
  const [data, setData] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [form, setForm] = useState({
    IDPROFILE: 0,
    NAMARS: "",
    ALAMAT: "",
    EMAIL: "",
    NOTELPAMBULAN: "",
    NOAMBULANWA: "",
    NOMORHOTLINE: "",
    DESKRIPSI: "",
    VISI: "",
    MISI: "",
    FOTOLOGO: undefined,
  });

  const [errors, setErrors] = useState({});
  const toastRef = useRef(null);

  const showToast = (severity, summary, detail) => {
    toastRef.current?.show({ severity, summary, detail, life: 3000 });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/profile_mobile`);
      if (res.data.data) {
        setData([res.data.data]);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error("Gagal mengambil data profil:", err);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.NAMARS.trim()) newErrors.NAMARS = "Nama rumah sakit wajib diisi";
    if (!form.ALAMAT.trim()) newErrors.ALAMAT = "Alamat wajib diisi";
    if (!form.EMAIL.trim()) newErrors.EMAIL = "Email wajib diisi";
    if (!form.NOTELPAMBULAN.trim()) newErrors.NOTELPAMBULAN = "Telp Ambulan wajib diisi";
    if (!form.NOAMBULANWA.trim()) newErrors.NOAMBULANWA = "Ambulan WA wajib diisi";
    if (!form.NOMORHOTLINE.trim()) newErrors.NOMORHOTLINE = "Hotline wajib diisi";
    if (!form.DESKRIPSI.trim()) newErrors.DESKRIPSI = "Deskripsi wajib diisi";
    if (!form.VISI.trim()) newErrors.VISI = "Visi wajib diisi";
    if (!form.MISI.trim()) newErrors.MISI = "Misi wajib diisi";
    if (!form.FOTOLOGO) newErrors.FOTOLOGO = "Logo wajib diunggah";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    const formData = new FormData();
    formData.append("NAMARS", form.NAMARS);
    formData.append("ALAMAT", form.ALAMAT);
    formData.append("EMAIL", form.EMAIL);
    formData.append("NOTELPAMBULAN", form.NOTELPAMBULAN);
    formData.append("NOAMBULANWA", form.NOAMBULANWA);
    formData.append("NOMORHOTLINE", form.NOMORHOTLINE);
    formData.append("DESKRIPSI", form.DESKRIPSI);
    formData.append("VISI", form.VISI);
    formData.append("MISI", form.MISI);
    if (form.FOTOLOGO instanceof File) {
      formData.append("FOTOLOGO", form.FOTOLOGO);
    }

    if (form.IDPROFILE) {
      await axios.put(`${API_URL}/profile_mobile/${form.IDPROFILE}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast("success", "Berhasil", "Berita berhasil diperbarui");
    } else {
      await axios.post(`${API_URL}/profile_mobile`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast("success", "Berhasil", "Berita berhasil ditambahkan");
    }

    fetchData();
    setDialogVisible(false);
  } catch (err) {
    console.error("Gagal menyimpan profil:", err);
    showToast("error", "Gagal", "Terjadi kesalahan saat menyimpan profil");
  }
};

  const handleEdit = (row) => {
    setForm(row);
    setDialogVisible(true);
  };

  const inputClass = (field) =>
    errors[field] ? "p-invalid w-full mt-2" : "w-full mt-2";

  return (
    <div className="card">
      <Toast ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Profil Rumah Sakit</h3>

      <TabelProfile data={data} onEdit={handleEdit} loading={false} />

      <FormDialogProfile
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        errors={errors}
        inputClass={inputClass}
      />
    </div>
  );
}
