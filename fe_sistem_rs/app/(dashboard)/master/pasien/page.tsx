"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import TabelPasien from "./components/tabelPasien";
import { Pasien } from "@/types/pasien";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import HeaderBar from "@/app/components/headerbar";
import FormDialogPasien from "./components/formDialogPasien";

const MasterPasien = () => {
  const [data, setData] = useState<Pasien[]>([]);
  const [originalData, setOriginalData] = useState<Pasien[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [form, setForm] = useState<Pasien>({
    NIK: "",
    NAMALENGKAP: "",
    TANGGALLAHIR: "",
    JENISKELAMIN: "L",
    ASURANSI: "Umum",
    ALAMAT: "",
    NOHP: "",
    AGAMA: "",
    GOLDARAH: "",
    NOASURANSI: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [pasienOptions, setPasienOptions] = useState<
    { label: string; value: string; NAMALENGKAP: string }[]
  >([]);
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/api/pasien");
      setData(res.data.data);
      setOriginalData(res.data.data);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPasienOptions = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/pasien");
      const options = res.data.data.map((pasien: any) => ({
        label: `${pasien.NIK} - ${pasien.NAMALENGKAP}`,
        value: pasien.NIK,
        NAMALENGKAP: pasien.NAMALENGKAP,
      }));
      setPasienOptions(options);
    } catch (err) {
      console.error("Gagal ambil data pasien:", err);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.NAMALENGKAP.trim()) newErrors.NAMALENGKAP = "Nama wajib diisi";
    if (!form.NIK.trim()) {
      newErrors.NIK = "NIK wajib diisi";
    } else if (!/^\d{16}$/.test(form.NIK)) {
      newErrors.NIK = "NIK harus 16 digit angka";
    }

    if (!form.TANGGALLAHIR)
      newErrors.TANGGALLAHIR = "Tanggal lahir wajib diisi";
    if (!form.JENISKELAMIN)
      newErrors.JENISKELAMIN = "Jenis kelamin wajib dipilih";
    if (!form.ALAMAT?.trim()) newErrors.ALAMAT = "Alamat wajib diisi";
    if (!form.NOHP?.trim()) {
      newErrors.NOHP = "No HP wajib diisi";
    } else if (!/^\d+$/.test(form.NOHP)) {
      newErrors.NOHP = "No HP hanya boleh berisi angka";
    }

    if (!form.AGAMA?.trim()) newErrors.AGAMA = "Agama wajib diisi";
    if (!form.GOLDARAH) newErrors.GOLDARAH = "Golongan darah wajib dipilih";
    if (!form.ASURANSI) newErrors.ASURANSI = "Asuransi wajib dipilih";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = (keyword: string) => {
    if (!keyword) {
      setData(originalData);
    } else {
      const filtered = originalData.filter(
        (item) =>
          item.NIK.toLowerCase().includes(keyword) ||
          item.NAMALENGKAP.toLowerCase().includes(keyword)
      );
      setData(filtered);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const isEdit = !!form.IDPASIEN;
    const url = isEdit
      ? `http://localhost:4000/api/pasien/${form.IDPASIEN}`
      : "http://localhost:4000/api/pasien";

    try {
      const payload = {
        ...form,
        TANGGALLAHIR: form.TANGGALLAHIR,
      };

      if (isEdit) {
        await axios.put(url, payload);
      } else {
        await axios.post(url, payload);
      }

      fetchData();
      setDialogVisible(false);
      resetForm();
    } catch (err) {
      console.error("Gagal simpan data:", err);
    }
  };

  const resetForm = () => {
    setForm({
      NIK: "",
      NAMALENGKAP: "",
      TANGGALLAHIR: "",
      JENISKELAMIN: "L",
      ASURANSI: "Umum",
      ALAMAT: "",
      NOHP: "",
      AGAMA: "",
      GOLDARAH: "",
      NOASURANSI: "",
    });
    setErrors({});
  };

  const handleEdit = (row: Pasien) => {
    const formattedTanggal = row.TANGGALLAHIR
      ? new Date(row.TANGGALLAHIR).toISOString().split("T")[0]
      : "";

    setForm({
      ...row,
      TANGGALLAHIR: formattedTanggal,
    });

    setDialogVisible(true);
  };

  const handleDelete = async (row: Pasien) => {
    try {
      await axios.delete(`http://localhost:4000/api/pasien/${row.IDPASIEN}`);
      fetchData();
    } catch (err) {
      console.error("Gagal hapus data:", err);
    }
  };

  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
    }

    fetchData();
  }, []);

  const inputClass = (field: string) =>
    errors[field] ? "p-invalid w-full mt-2" : "w-full mt-2";

  return (
    <div className="card">
      <h3 className="text-xl font-semibold">Master Data Pasien</h3>

      <HeaderBar
        title=""
        placeholder="Cari berdasarkan NIK atau Nama"
        onSearch={handleSearch}
        onAddClick={() => {
          resetForm();
          setDialogVisible(true);
        }}
      />

      <TabelPasien
        data={data}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialogPasien
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
        }}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        errors={errors}
      />
    </div>
  );
};

export default MasterPasien;
