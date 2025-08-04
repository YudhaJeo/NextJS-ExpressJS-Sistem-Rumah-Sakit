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
  const [allRiwayatOptions, setAllRiwayatOptions] = useState([]);
  const [formData, setFormData] = useState({
    IDKOMISI: 0,
    IDPENGOBATAN: "",
    NIK: "",
    NAMAPASIEN: "",
    NAMADOKTER: "",
    TANGGAL: "",
    NILAIKOMISI: "",
    STATUS: "",
    KETERANGAN: "",
  });

  const [riwayatOptions, setRiwayatOptions] = useState([]);
  const toastRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    fetchData();
    fetchRiwayat();
  }, []);

  useEffect(() => {
    if (formData.IDPENGOBATAN && allRiwayatOptions.length > 0) {
      const selected = allRiwayatOptions.find(
        (opt) => String(opt.value) === String(formData.IDPENGOBATAN)
      );
      if (selected) {
        setFormData((prev) => ({
          ...prev,
          NIK: selected.NIK,
          NAMAPASIEN: selected.NAMAPASIEN,
          NAMADOKTER: selected.NAMADOKTER,
          TANGGAL: selected.TANGGAL,
        }));
      }
    }
  }, [formData.IDPENGOBATAN, allRiwayatOptions]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/komisi_dokter`);
      console.log("komisi_dokter:", res.data);
      setData(res.data);
      setOriginalData(res.data);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatTanggal = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }).format(date);
  };

  const fetchRiwayat = async () => {
    try {
      const res = await axios.get(`${API_URL}/riwayat_pengobatan`);
      console.log("riwayat_pengobatan:", res.data);
      const options = res.data.data.map((item) => ({
        label: `${item.NAMADOKTER} - ${item.NAMALENGKAP} (${formatTanggal(item.TANGGALKUNJUNGAN)})`,
        value: item.IDPENGOBATAN,
        NIK: item.NIK,
        NAMAPASIEN: item.NAMALENGKAP,
        NAMADOKTER: item.NAMADOKTER,
        TANGGAL: formatTanggal(item.TANGGALKUNJUNGAN),
      }));
      setRiwayatOptions(options);
      setAllRiwayatOptions(options);
    } catch (err) {
      console.error("Gagal ambil data Riwayat:", err);
    }
  };

  const handleSearch = (keyword) => {
    if (!keyword) {
      setData(originalData);
    } else {
      const filtered = originalData.filter((item) =>
        item.NAMAPASIEN?.toLowerCase().includes(keyword.toLowerCase())
      );
      setData(filtered);
    }
  };

  const handleSubmit = async () => {
    const {
      IDPENGOBATAN,
      NILAIKOMISI,
      STATUS,
      KETERANGAN,
    } = formData;

    if (!IDPENGOBATAN || !NILAIKOMISI || !STATUS || !KETERANGAN) {
      toastRef.current?.showToast("01", "Field wajib tidak boleh kosong!");
      return;
    }

    const isEdit = !!formData.IDKOMISI;
    const url = isEdit
      ? `${API_URL}/komisi_dokter/${formData.IDKOMISI}`
      : `${API_URL}/komisi_dokter`;

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
    const selected = allRiwayatOptions.find(
      (opt) => String(opt.value) === String(row.IDPENGOBATAN)
    );
    setFormData({
      IDKOMISI: row.IDKOMISI,
      IDPENGOBATAN: row.IDPENGOBATAN,
      NIK: selected?.NIK || row.NIK || "",
      NAMAPASIEN: selected?.NAMAPASIEN || row.NAMAPASIEN || "",
      NAMADOKTER: selected?.NAMADOKTER || row.NAMADOKTER || "",
      TANGGAL: selected?.TANGGAL || row.TANGGAL || "",
      NILAIKOMISI: row.NILAIKOMISI,
      STATUS: row.STATUS,
      KETERANGAN: row.KETERANGAN,
    });
    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    confirmDialog({
      message: `Hapus data komisi untuk pasien ${row.NAMAPASIEN}?`,
      header: "Konfirmasi Hapus",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Ya",
      rejectLabel: "Batal",
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/komisi_dokter/${row.IDKOMISI}`);
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
      IDPENGOBATAN: "",
      NIK: "",
      NAMAPASIEN: "",
      NAMADOKTER: "",
      TANGGAL: "",
      NILAIKOMISI: "",
      STATUS: "",
      KETERANGAN: "",
    });
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />
      <h3 className="text-xl font-semibold mb-3">Manajemen Komisi Dokter</h3>

      <HeaderBar
        placeholder="Cari nama pasien..."
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
        riwayatOptions={riwayatOptions}
        allRiwayatOptions={allRiwayatOptions}
      />
    </div>
  );
};

export default KomisiPage;
