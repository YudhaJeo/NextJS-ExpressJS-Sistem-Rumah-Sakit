"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import TabelData from "./components/tabeldata";
import FormDialogData from "./components/formDialogdata";
import HeaderBar from "@/app/components/headerbar";
import ToastNotifier from "@/app/components/toastNotifier";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const DokterPage = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [poliOptions, setPoliOptions] = useState([]);
  const [formData, setFormData] = useState({
    IDDOKTER: 0,
    NAMA_DOKTER: "",
    IDPOLI: null,
    JADWALPRAKTEK: "",
    NO_TELEPON: "",
    EMAIL: "",
    ALAMAT: "",
    JENIS_KELAMIN: ""
  });

  const toastRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchDokter();
    fetchPoli();
  }, []);

  const fetchDokter = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/datadokter`);
      setData(res.data);
      setOriginalData(res.data);
    } catch (err) {
      console.error("Gagal ambil dokter:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPoli = async () => {
  try {
    const res = await axios.get(`${API_URL}/poli`);
    console.log('Data poli API:', res.data);

    const options = res.data.map((poli) => ({
      label: `${poli.NAMAPOLI}`,
      value: poli.IDPOLI,
      }));

    setPoliOptions(options);
      } catch (err) {
    console.error('Gagal ambil data poli:', err);
      }
    };

  const handleSearch = (keyword) => {
    if (!keyword) {
      setData(originalData);
    } else {
      const filtered = originalData.filter((item) =>
        item.NAMA_DOKTER.toLowerCase().includes(keyword.toLowerCase())
      );
      setData(filtered);
    }
  };

  const handleSubmit = async () => {
    if (!formData.NAMA_DOKTER || !formData.EMAIL || !formData.JENIS_KELAMIN) {
      toastRef.current?.showToast("01", "Nama, Email, dan Jenis Kelamin wajib diisi!");
      return;
    }

    const isEdit = !!formData.IDDOKTER;
    const url = isEdit
      ? `${API_URL}/datadokter/${formData.IDDOKTER}`
      : `${API_URL}/datadokter`;

    try {
      if (isEdit) {
        await axios.put(url, formData);
        toastRef.current?.showToast("00", "Berhasil diperbarui");
      } else {
        await axios.post(url, formData);
        toastRef.current?.showToast("00", "Berhasil ditambahkan");
      }
      fetchDokter();
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
      message: `Hapus Dokter ${row.NAMA_DOKTER}?`,
      header: "Konfirmasi Hapus",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Ya",
      rejectLabel: "Batal",
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/datadokter/${row.IDDOKTER}`);
          fetchDokter();
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
      IDDOKTER: 0,
      NAMA_DOKTER: "",
      IDPOLI: null,
      JADWALPRAKTEK: "",
      NO_TELEPON: "",
      EMAIL: "",
      ALAMAT: "",
      JENIS_KELAMIN: ""
    });
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />
      <h3 className="text-xl font-semibold mb-3">Data Dokter</h3>

      <HeaderBar
        placeholder="Cari Nama Dokter..."
        onSearch={handleSearch}
        onAddClick={() => {
          resetForm();
          setDialogVisible(true);
        }}
      />

      <TabelData data={data} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />

      <FormDialogData
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
        }}
        onChange={setFormData}
        onSubmit={handleSubmit}
        formData={formData}
        poliOptions={poliOptions}
      />
    </div>
  );
};

export default DokterPage;
