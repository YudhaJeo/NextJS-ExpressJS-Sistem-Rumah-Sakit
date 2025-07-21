"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import FormDialogPengobatan from "./components/formDialogRiwayat";
import TabelPengobatan from "./components/tabelRiwayat";
import HeaderBar from "@/app/components/headerbar";
import ToastNotifier from "@/app/components/toastNotifier";
import FilterTanggal from '@/app/components/filterTanggal';
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const RiwayatPengobatanPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [originalData, setOriginalData] = useState([]);  
  const [form, setForm] = useState(initialForm());
  const [pendaftaranOptions, setPendaftaranOptions] = useState([]);
  const toastRef = useRef(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);  
  const [dokterOptions, setDokterOptions] = useState([]);
  const [allDokterOptions, setAllDokterOptions] = useState([]);

  useEffect(() => {
    fetchData();
    fetchPendaftaran();
    fetchDokter();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/riwayat_pengobatan`);
      setData(res.data.data);
      setOriginalData(res.data.data);
    } catch (err) {
      console.error("Gagal ambil data riwayat:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendaftaran = async () => {
    try {
      const res = await axios.get(`${API_URL}/pendaftaran`);
      const options = res.data.data.map((p) => ({
        label: `${p.NIK} - ${p.NAMALENGKAP}`,
        value: p.IDPENDAFTARAN,
        NIK: p.NIK,
        NAMALENGKAP: p.NAMALENGKAP,
        TANGGALKUNJUNGAN: p.TANGGALKUNJUNGAN?.split("T")[0] || "",
        KELUHAN: p.KELUHAN,
        POLI: p.POLI,
      }));
      setPendaftaranOptions(options);
    } catch (err) {
      console.error("Gagal ambil data pendaftaran:", err);
    }
  };

  const fetchDokter = async () => {
    try {
      const res = await axios.get(`${API_URL}/dokter`);
      console.log("Data Dokter API:", res.data);
      const options = res.data.map((dokter) => ({
        label: `${dokter.NAMALENGKAP} - ${dokter.NAMAPOLI}`,
        value: dokter.IDDOKTER,
        IDTENAGAMEDIS: dokter.IDTENAGAMEDIS,
        POLI: dokter.NAMAPOLI,
      }));
      setAllDokterOptions(options);
      setDokterOptions([]);
    } catch (err) {
      console.error("Gagal ambil data Dokter:", err);
    }
  };

  useEffect(() => {
    if (form.POLI) {
      const filtered = allDokterOptions.filter((dokter) => dokter.POLI === form.POLI);
      setDokterOptions(filtered);
    } else {
      setDokterOptions([]);
    }
  }, [form.POLI, allDokterOptions]);

  const resetFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setData(originalData);
  };  

  const handleSubmit = async () => {
    const isEdit = !!form.IDPENGOBATAN;
    const url = isEdit
      ? `${API_URL}/riwayat_pengobatan/${form.IDPENGOBATAN}`
      : `${API_URL}/riwayat_pengobatan`;

    const payload = {
      IDPENDAFTARAN: form.IDPENDAFTARAN,
      IDDOKTER: form.IDDOKTER,
      IDPOLI: form.IDPOLI,
      STATUSKUNJUNGAN: form.STATUSKUNJUNGAN,
      STATUSRAWAT: form.STATUSRAWAT,
      DIAGNOSA: form.DIAGNOSA,
      OBAT: form.OBAT,
    };

    try {
      if (isEdit) {
        await axios.put(url, payload);
        toastRef.current?.showToast("00", "Data berhasil diperbarui");
      } else {
        await axios.post(url, payload);
        toastRef.current?.showToast("00", "Data berhasil ditambahkan");
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
    setForm({ ...row });
    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    confirmDialog({
      message: `Hapus riwayat ${row.NAMALENGKAP}?`,
      header: "Konfirmasi Hapus",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Ya",
      rejectLabel: "Batal",
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/riwayat_pengobatan/${row.IDPENGOBATAN}`);
          fetchData();
          toastRef.current?.showToast("00", "Data berhasil dihapus");
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
      <h3 className="text-xl font-semibold mb-3">Riwayat Pengobatan</h3>

      <div className="flex flex-col md:flex-row justify-content-between md:items-center gap-4">
        <FilterTanggal
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          handleDateFilter={handleDateFilter}
          resetFilter={resetFilter}
        />      
        <HeaderBar
          onAddClick={() => {
            resetForm();
            setDialogVisible(true);
          }}
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
        pendaftaranOptions={pendaftaranOptions}
        dokterOptions={dokterOptions}
      />
    </div>
  );
};

const initialForm = () => ({
  IDPENGOBATAN: "",
  IDPENDAFTARAN: "",
  NIK: "",
  NAMALENGKAP: "",
  TANGGALKUNJUNGAN: "",
  KELUHAN: "",
  POLI: "",
  STATUSKUNJUNGAN: "Diperiksa",
  STATUSRAWAT: "",
  DIAGNOSA: "",
  OBAT: "",
});

export default RiwayatPengobatanPage;