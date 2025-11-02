"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
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
    FOTOLOGO: "",
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async () => {
  if (!validateForm()) return;
  try {
    // Jika user memilih gambar, konversi jadi base64
    let updatedForm = { ...form };

    if (form.FOTOLOGO instanceof File) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        updatedForm.FOTOLOGO = reader.result; // base64 string
        await submitData(updatedForm);
      };
      reader.readAsDataURL(form.FOTOLOGO);
    } else {
      await submitData(updatedForm);
    }
  } catch (err) {
    console.error("Gagal menyimpan profil:", err);
    showToast("error", "Gagal", "Terjadi kesalahan saat menyimpan profil");
  }
};

// Fungsi bantu untuk kirim data ke API
const submitData = async (data) => {
  await axios.put(`${API_URL}/profile_mobile`, data, {
    headers: { "Content-Type": "application/json" },
  });

  showToast("success", "Berhasil", "Profil berhasil diperbarui");
  setDialogVisible(false);
  fetchData();
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

      <div className="flex justify-end mb-3">
        <HeaderBar
          title=""
          placeholder="Cari profil..."
          onSearch={() => {}}
        />
      </div>

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
