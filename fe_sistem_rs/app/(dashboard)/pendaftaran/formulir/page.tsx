"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import TabelPendaftaran from "./components/tabelPasien";
import { Pendaftaran } from "@/types/formulir";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import HeaderBar from "@/components/headerbar";
import FormDialogPendaftaran from "./components/formDialogFormulir";

const Page = () => {
  const [data, setData] = useState<Pendaftaran[]>([]);
  const [originalData, setOriginalData] = useState<Pendaftaran[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [form, setForm] = useState<Pendaftaran>({
    IDPENDAFTARAN: 0,
    NIK: "",
    NAMALENGKAP: "",
    TANGGALKUNJUNGAN: "",
    LAYANAN: "Rawat Jalan",
    POLI: "",
    NAMADOKTER: "",
    STATUSKUNJUNGAN: "Diperiksa",
  });

  const [pasienOptions, setPasienOptions] = useState<
    { label: string; value: string; NAMALENGKAP: string }[]
  >([]);

  const fetchPasien = async () => {
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/api/pendaftaran");
      setData(res.data.data);
      setOriginalData(res.data.data);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    } finally {
      setLoading(false);
    }
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
    const isEdit = !!form.IDPENDAFTARAN;
    const url = isEdit
      ? `http://localhost:4000/api/pendaftaran/${form.IDPENDAFTARAN}`
      : "http://localhost:4000/api/pendaftaran";

    try {
      if (isEdit) {
        await axios.put(url, form);
      } else {
        await axios.post(url, form);
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
      IDPENDAFTARAN: 0,
      NAMALENGKAP: "",
      NIK: "",
      TANGGALKUNJUNGAN: "",
      LAYANAN: "Rawat Jalan",
      POLI: "",
      NAMADOKTER: "",
      STATUSKUNJUNGAN: "Diperiksa",
    });
  };

  const handleEdit = (row: Pendaftaran) => {
    setForm({
      ...row,
      TANGGALKUNJUNGAN: row.TANGGALKUNJUNGAN?.split("T")[0] || "",
      NAMALENGKAP: row.NAMALENGKAP || "",
    });
    setDialogVisible(true);
  };

  const handleDelete = async (row: Pendaftaran) => {
    try {
      await axios.delete(
        `http://localhost:4000/api/pendaftaran/${row.IDPENDAFTARAN}`
      );
      fetchData();
    } catch (err) {
      console.error("Gagal hapus data:", err);
    }
  };

  const router = useRouter();

  useEffect(() => {
    fetchData();
    fetchPasien();

    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
    }
  }, []);

  return (
    <div className="card">
      <h3 className="text-xl font-semibold">Formulir Pendaftaran Kunjungan</h3>

      <HeaderBar
        title=""
        placeholder="Cari nama atau NIK..."
        onSearch={handleSearch}
        onAddClick={() => setDialogVisible(true)}
      />

      <TabelPendaftaran
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialogPendaftaran
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
        }}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        pasienOptions={pasienOptions}
      />
    </div>
  );
};

export default Page;
