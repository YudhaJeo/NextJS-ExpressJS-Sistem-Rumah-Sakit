"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import TabelKomisiDokter from "./components/tabelKomisi";
import FormDialogKomisi from "./components/formDialogKomisi";
import HeaderBar from "@/app/components/headerbar";
import ToastNotifier from "@/app/components/toastNotifier";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const KomisiPage = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [allDokterOptions, setAllDokterOptions] = useState([]);
  const [formData, setFormData] = useState({
    IDKOMISI: 0,
    IDDOKTER: "",
    TANGGAL_LAYANAN: "",
    NAMA_LAYANAN:"",
    BIAYA_LAYANAN:"",
    PERSENTASE_KOMISI:"",
    NILAI_KOMISI:"",
    STATUS: "",
    TANGGAL_PEMBAYARAN: "",
    KETERANGAN:"",
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
    fetchData();
    fetchDokter();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/komisidokter`);
      setData(res.data);
      setOriginalData(res.data);
    } catch (err) {
      console.error('Gagal ambil data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDokter = async () => {
  try {
    const res = await axios.get(`${API_URL}/dokter`);
    console.log('Data poli API:', res.data);

    const options = res.data.map((dokter) => ({
      label: `${dokter.NAMADOKTER}`,
      value: dokter.IDDOKTER,
    }));

    setDokterOptions(options);
    setAllDokterOptions(options);
  } catch (err) {
    console.error('Gagal ambil data Dokter:', err);
  }
};

  const handleSearch = (keyword) => {
    if (!keyword) {
      setData(originalData);
    } else {
      const filtered = originalData.filter((item) =>
        item.NAMADOKTER.toLowerCase().includes(keyword.toLowerCase())

      );
      setData(filtered);
    }
  };

  const handleSubmit = async () => {
    const {
        IDDOKTER,
        TANGGAL_LAYANAN,
        NAMA_LAYANAN,
        BIAYA_LAYANAN,
        PERSENTASE_KOMISI,
        NILAI_KOMISI,
        STATUS,
        TANGGAL_PEMBAYARAN,
        KETERANGAN,
    } = formData;

    if (!IDDOKTER || !TANGGAL_LAYANAN || !NAMA_LAYANAN || !BIAYA_LAYANAN || !PERSENTASE_KOMISI || !NILAI_KOMISI || !STATUS || !TANGGAL_PEMBAYARAN || !KETERANGAN) {
      toastRef.current?.showToast("01", "Field wajib tidak boleh kosong!");
      return;
    }

    const isEdit = !!formData.IDKOMISI;
    const url = isEdit
      ? `${API_URL}/komisidokter/${formData.IDKOMISI}`
      : `${API_URL}/komisidokter`;

    try {
      if (isEdit) {
        await axios.put(url, formData);
        toastRef.current?.showToast("00", "Data berhasil diperbarui");
      } else {
        await axios.post(url, formData);
        toastRef.current?.showToast("00", "Data berhasil ditambahkan");
      }
      fetchData();
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
      message: `Hapus Data Dokter dengan email ${row.EMAIL}?`,
      header: "Konfirmasi Hapus",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Ya",
      rejectLabel: "Batal",
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/datadokter/${row.IDDATA}`);
          fetchData();
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
        IDKOMISI: 0,
        IDDOKTER: "",
        TANGGAL_LAYANAN: "",
        NAMA_LAYANAN:"",
        BIAYA_LAYANAN:"",
        PERSENTASE_KOMISI:"",
        NILAI_KOMISI:"",
        STATUS: "",
        TANGGAL_PEMBAYARAN: "",
        KETERANGAN:"",
    });
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />
      <h3 className="text-xl font-semibold mb-3">Manajemen Komisi</h3>

      <HeaderBar
        placeholder="Cari Email Dokter..."
        onSearch={handleSearch}
        onAddClick={() => {
          resetForm();
          setDialogVisible(true);
        }}
      />

      <TabelKomisiDokter
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialogKomisi
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

export default KomisiPage;
