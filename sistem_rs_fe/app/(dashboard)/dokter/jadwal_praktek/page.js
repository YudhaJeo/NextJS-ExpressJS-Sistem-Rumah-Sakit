// app/jadwalpraktek/page.js
"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import TabelJadwal from "./components/tabeljadwal";
import FormDialogJadwal from "./components/formDialogjadwal";
import HeaderBar from "@/app/components/headerbar";
import ToastNotifier from "@/app/components/toastNotifier";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const JadwalPraktekPage = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [allDokterOptions, setAllDokterOptions] = useState([]);
  const [formData, setFormData] = useState({
    ID: 0,
    IDDOKTER: "",
    HARI: "",
    JAM_MULAI: "",
    JAM_SELESAI: "",
  });

  const [dokterOptions, setDokterOptions] = useState([]);
  const toastRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchJadwal();
    fetchDokter();
  }, []);

  const fetchJadwal = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/jadwalpraktek`);
      setData(res.data);
      setOriginalData(res.data);
    } catch (err) {
      console.error("Gagal ambil data jadwal:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchDokter = async () => {
  try {
    const res = await axios.get(`${API_URL}/datadokter`);
    console.log('Data poli API:', res.data);

    const options = res.data.map((data_dokter) => ({
      label: `${data_dokter.NAMA_DOKTER}`,
      value: data_dokter.IDDOKTER,
      jadwal: data_dokter.JADWALPRAKTEK,
    }));

    setDokterOptions(options);
    setAllDokterOptions(options);
  } catch (err) {
    console.error('Gagal ambil data poli:', err);
  }
};

  const handleSearch = (keyword) => {
    if (!keyword) {
      setData(originalData);
    } else {
      const filtered = originalData.filter((item) =>
        item.IDDOKTER.toLowerCase().includes(keyword.toLowerCase())
      );
      setData(filtered);
    }
  };

  const handleSubmit = async () => {
    if (!formData.IDDOKTER || !formData.HARI || !formData.JAM_MULAI || !formData.JAM_SELESAI) {
      toastRef.current?.showToast("01", "Semua field wajib diisi!");
      return;
    }

    const isEdit = !!formData.ID;
    const url = isEdit
      ? `${API_URL}/jadwalpraktek/${formData.ID}`
      : `${API_URL}/jadwalpraktek`;

    try {
      if (isEdit) {
        await axios.put(url, formData);
        toastRef.current?.showToast("00", "Berhasil diperbarui");
      } else {
        await axios.post(url, formData);
        toastRef.current?.showToast("00", "Berhasil ditambahkan");
      }
      fetchJadwal();
      setDialogVisible(false);
      resetForm();
    } catch (err) {
      console.error("Gagal simpan:", err);
      toastRef.current?.showToast("01", "Gagal menyimpan data");
    }
  };

  const handleEdit = (row) => {
    setFormData(row);
    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    confirmDialog({
      message: `Hapus Jadwal Dokter ${row.IDDOKTER}?`,
      header: "Konfirmasi Hapus",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Ya",
      rejectLabel: "Batal",
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/jadwalpraktek/${row.ID}`);
          fetchJadwal();
          toastRef.current?.showToast("00", "Berhasil dihapus");
        } catch (err) {
          console.error("Gagal hapus:", err);
          toastRef.current?.showToast("01", "Gagal hapus data");
        }
      },
    });
  };

  const resetForm = () => {
    setFormData({
      ID: 0,
      IDDOKTER: "",
      HARI: "",
      JAM_MULAI: "",
      JAM_SELESAI: "",
    });
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />
      <h3 className="text-xl font-semibold mb-3">Jadwal Praktek Dokter</h3>

      <HeaderBar
        placeholder="Cari Nama Dokter..."
        onSearch={handleSearch}
        onAddClick={() => {
          resetForm();
          setDialogVisible(true);
        }}
      />

      <TabelJadwal data={data} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />

      <FormDialogJadwal
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
        }}
        onChange={setFormData}
        onSubmit={handleSubmit}
        formData={formData}
        dokterOptions={dokterOptions}
        setDokterOptions={setDokterOptions}
        allDokterOptions={allDokterOptions}
      />
    </div>
  );
};

export default JadwalPraktekPage;
