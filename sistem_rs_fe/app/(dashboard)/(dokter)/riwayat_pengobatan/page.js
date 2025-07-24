"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import FormDialogPengobatan from "./components/formDialogRiwayat";
import TabelPengobatan from "./components/tabelRiwayat";
import ToastNotifier from "@/app/components/toastNotifier";
import FilterTanggal from "@/app/components/filterTanggal";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialForm = () => ({
  IDPENGOBATAN: "",
  IDDOKTER: "",
  IDPENDAFTARAN: "",
  STATUSKUNJUNGAN: "Diperiksa",
  STATUSRAWAT: "Rawat Jalan",
  DIAGNOSA: "",
  OBAT: "",
});

const RiwayatPengobatanPage = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [form, setForm] = useState(initialForm());
  const toastRef = useRef(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dokterOptions, setDokterOptions] = useState([]);
  const [pendaftaranOptions, setPendaftaranOptions] = useState([]);

  useEffect(() => {
    fetchData();
    fetchDokter();
  }, []);

  const fetchData = async () => {
  setLoading(true);
  try {
    const res = await axios.get(`${API_URL}/riwayat_pengobatan`);
    const list = res.data.data || [];
    setData(list);
    setOriginalData(list);

    // Dropdown Pendaftaran (ambil dari /pendaftaran)
    const daftarRes = await axios.get(`${API_URL}/pendaftaran`);
    const options = daftarRes.data.data.map((item) => {
      const d = new Date(item.TANGGALKUNJUNGAN);
      const tanggalFormatted = `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${d.getFullYear()}`;

      return {
        label: `${item.NAMALENGKAP} - ${tanggalFormatted}`,
        value: item.IDPENDAFTARAN,
      };
    });
    setPendaftaranOptions(options);
  } catch (err) {
    console.error("Gagal ambil data monitoring:", err);
    toastRef.current?.showToast("01", "Gagal mengambil data dari server");
  } finally {
    setLoading(false);
  }
};


  const fetchDokter = async () => {
    try {
      const res = await axios.get(`${API_URL}/dokter`);
      const options = res.data.map((dokter) => ({
        label: dokter.NAMALENGKAP,
        value: dokter.IDDOKTER,
      }));
      setDokterOptions(options);
    } catch (err) {
      console.error("Gagal ambil data Dokter:", err);
    }
  };

  const resetForm = () => setForm(initialForm());

  const resetFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setData(originalData);
  };

  const handleDateFilter = () => {
    if (!startDate && !endDate) return setData(originalData);

    const filtered = originalData.filter((item) => {
      const visitDate = new Date(item.TANGGALKUNJUNGAN);
      const from = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
      const to = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;
      return (!from || visitDate >= from) && (!to || visitDate <= to);
    });

    setData(filtered);
  };

  const handleSubmit = async () => {
    const payload = {
      IDDOKTER: form.IDDOKTER,
      IDPENDAFTARAN: form.IDPENDAFTARAN,
      STATUSKUNJUNGAN: form.STATUSKUNJUNGAN,
      STATUSRAWAT: form.STATUSRAWAT,
      DIAGNOSA: form.DIAGNOSA,
      OBAT: form.OBAT,
    };

    try {
      if (form.IDPENGOBATAN) {
        await axios.put(`${API_URL}/riwayat_pengobatan/${form.IDPENGOBATAN}`, payload);
        toastRef.current?.showToast("00", "Data berhasil diperbarui");
      }

      fetchData();
      setDialogVisible(false);
      resetForm();
    } catch (err) {
      console.error("Gagal simpan data:", err);
      toastRef.current?.showToast("01", "Gagal menyimpan data");
    }
  };

  const handleEdit = (row) => {
    setForm({
      IDPENGOBATAN: row.IDPENGOBATAN,
      IDDOKTER: row.IDDOKTER || "",
      IDPENDAFTARAN: row.IDPENDAFTARAN || "",
      STATUSKUNJUNGAN: row.STATUSKUNJUNGAN || "Diperiksa",
      STATUSRAWAT: row.STATUSRAWAT || "Rawat Jalan",
      DIAGNOSA: row.DIAGNOSA || "",
      OBAT: row.OBAT || "",
    });
    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    if (!row.IDPENGOBATAN || !row.IDPENDAFTARAN) {
      toastRef.current?.showToast("01", "Data tidak valid untuk dihapus");
      return;
    }

    confirmDialog({
      message: `Hapus data pengobatan dan pendaftaran untuk ${row.IDPENGOBATAN}?`,
      header: "Konfirmasi Hapus",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Ya",
      rejectLabel: "Batal",
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/riwayat_pengobatan/${row.IDPENGOBATAN}`);
          await axios.delete(`${API_URL}/pendaftaran/${row.IDPENDAFTARAN}`);
          toastRef.current?.showToast("00", "Data berhasil dihapus");
          fetchData();
        } catch (err) {
          console.error("Gagal hapus data:", err);
          toastRef.current?.showToast("01", "Gagal menghapus data");
        }
      },
    });
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Monitoring Riwayat Pengobatan</h3>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <FilterTanggal
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          handleDateFilter={handleDateFilter}
          resetFilter={resetFilter}
        />
      </div>

      <TabelPengobatan
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialogPengobatan
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
        }}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        dokterOptions={dokterOptions}
        pendaftaranOptions={pendaftaranOptions}
      />
    </div>
  );
};

export default RiwayatPengobatanPage;
