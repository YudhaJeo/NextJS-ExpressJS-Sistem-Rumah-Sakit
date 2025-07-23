"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import FormDialogPengobatan from "./components/formDialogRiwayat";
import TabelPengobatan from "./components/tabelRiwayat";
import ToastNotifier from "@/app/components/toastNotifier";
import FilterTanggal from "@/app/components/filterTanggal";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const RiwayatPengobatanPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [originalData, setOriginalData] = useState([]);
  const [form, setForm] = useState(initialForm());
  const toastRef = useRef(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/pendaftaran`);
      setData(res.data.data);
      setOriginalData(res.data.data);
    } catch (err) {
      console.error("Gagal ambil data monitoring:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setData(originalData);
  };

  const handleSubmit = async () => {
    if (!form.IDPENGOBATAN) {
      toastRef.current?.showToast("01", "Tidak dapat menyimpan data baru dari monitoring.");
      return;
    }

    const payload = {
      STATUSKUNJUNGAN: form.STATUSKUNJUNGAN,
      STATUSRAWAT: form.STATUSRAWAT,
      DIAGNOSA: form.DIAGNOSA,
      OBAT: form.OBAT,
    };

    try {
      await axios.put(`${API_URL}/riwayat_pengobatan/${form.IDPENGOBATAN}`, payload);
      toastRef.current?.showToast("00", "Data berhasil diperbarui");
      fetchData();
      setDialogVisible(false);
      resetForm();
    } catch (err) {
      console.error("Gagal update data:", err);
      toastRef.current?.showToast("01", "Gagal memperbarui data");
    }
  };

  const handleEdit = (row) => {
    setForm({
      IDPENGOBATAN: row.IDPENGOBATAN,
      STATUSKUNJUNGAN: row.STATUSKUNJUNGAN || "Diperiksa",
      STATUSRAWAT: row.STATUSRAWAT || "",
      DIAGNOSA: row.DIAGNOSA || "",
      OBAT: row.OBAT || "",
    });
    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    if (!row.IDPENGOBATAN) {
      toastRef.current?.showToast("01", "Tidak ada data pengobatan untuk dihapus.");
      return;
    }

    confirmDialog({
      message: `Hapus data pengobatan untuk ${row.NAMALENGKAP}?`,
      header: "Konfirmasi Hapus",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Ya",
      rejectLabel: "Batal",
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/riwayat_pengobatan/${row.IDPENGOBATAN}`);
          toastRef.current?.showToast("00", "Data berhasil dihapus");
          fetchData();
        } catch (err) {
          console.error("Gagal hapus data:", err);
          toastRef.current?.showToast("01", "Gagal menghapus data");
        }
      },
    });
  };

  const resetForm = () => {
    setForm(initialForm());
  };

  const handleDateFilter = () => {
    if (!startDate && !endDate) return setData(originalData);
    const filtered = originalData.filter((item) => {
      const visitDate = new Date(item.TANGGALKUNJUNGAN);
      const from = startDate ? new Date(startDate.setHours(0, 0, 0, 0)) : null;
      const to = endDate ? new Date(endDate.setHours(23, 59, 59, 999)) : null;
      return (!from || visitDate >= from) && (!to || visitDate <= to);
    });
    setData(filtered);
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />
      <h3 className="text-xl font-semibold mb-3">Monitoring Riwayat Pengobatan</h3>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
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
      />
    </div>
  );
};

const initialForm = () => ({
  IDPENGOBATAN: "",
  STATUSKUNJUNGAN: "Diperiksa",
  STATUSRAWAT: "",
  DIAGNOSA: "",
  OBAT: "",
});

export default RiwayatPengobatanPage;
