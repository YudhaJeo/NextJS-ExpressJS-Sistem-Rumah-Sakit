"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import ToastNotifier from "@/app/components/toastNotifier";
import FilterTanggal from "@/app/components/filterTanggal";
import FormDialogRawatJalan from "./components/formDialogRiwayat";
import TabelRawatJalan from "./components/tabelRiwayat";
import { Toast } from "primereact/toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialForm = () => ({
  IDRAWATJALAN: "",
  IDDOKTER: "",
  IDPENDAFTARAN: "",
  STATUSKUNJUNGAN: "Dalam Antrian",
  STATUSRAWAT: "Rawat Jalan",
  DIAGNOSA: "",
});

const RawatJalanPage = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [form, setForm] = useState(initialForm());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dokterOptions, setDokterOptions] = useState([]);
  const [pendaftaranOptions, setPendaftaranOptions] = useState([]);
  const [unitKerja, setUnitKerja] = useState(null);

  const toastRef = useRef(null);
  const toastUpload = useRef(null);

  async function fetchDokter() {
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
  }

  const fetchData = async (poliFilter) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/rawat_jalan`);
      let list = res.data.data || [];

      if (poliFilter) {
        list = list.filter((item) => item.POLI === poliFilter);
      }

      setData(list);
      setOriginalData(list);

      const daftarRes = await axios.get(`${API_URL}/pendaftaran`);
      let options = daftarRes.data.data;

      if (poliFilter) {
        options = options.filter((item) => item.POLI === poliFilter);
      }

      options = options.map((item) => {
        const d = new Date(item.TANGGALKUNJUNGAN);
        const tanggalFormatted = `${d.getDate().toString().padStart(2, "0")}-${(
          d.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${d.getFullYear()}`;
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

  useEffect(() => {
    const poliUser = Cookies.get("unitKerja");
    const roleUser = Cookies.get("role");
    setUnitKerja(roleUser === "Super Admin" ? null : poliUser || null);
    fetchData(roleUser === "Super Admin" ? null : poliUser || null);
    fetchDokter();
  }, []);

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
    };

    try {
      if (form.IDRAWATJALAN) {
        await axios.put(`${API_URL}/rawat_jalan/${form.IDRAWATJALAN}`, payload);
        toastRef.current?.showToast("00", "Data berhasil diperbarui");
      }
      fetchData(unitKerja);
      setDialogVisible(false);
      resetForm();
    } catch (err) {
      console.error("Gagal simpan data:", err);
      toastRef.current?.showToast("01", "Gagal menyimpan data");
    }
  };

  const handleEdit = (row) => {
    setForm({
      IDRAWATJALAN: row.IDRAWATJALAN,
      IDDOKTER: row.IDDOKTER || "",
      IDPENDAFTARAN: row.IDPENDAFTARAN || "",
      STATUSKUNJUNGAN: row.STATUSKUNJUNGAN || "Dalam Antrian",
      STATUSRAWAT: row.STATUSRAWAT || "Rawat Jalan",
      DIAGNOSA: row.DIAGNOSA || "",
    });
    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    confirmDialog({
      message: `Hapus data RawatJalan untuk ${row.IDRAWATJALAN}?`,
      header: "Konfirmasi Hapus",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Ya",
      rejectLabel: "Batal",
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/rawat_jalan/${row.IDRAWATJALAN}`);
          await axios.delete(`${API_URL}/pendaftaran/${row.IDPENDAFTARAN}`);
          toastRef.current?.showToast("00", "Data berhasil dihapus");
          fetchData(unitKerja);
        } catch (err) {
          console.error("Gagal hapus data:", err);
          toastRef.current?.showToast("01", "Gagal menghapus data");
        }
      },
    });
  };

  return (
    <div className="card p-4">
      <ToastNotifier ref={toastRef} />
      <Toast ref={toastUpload} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Monitoring Rawat Jalan</h3>

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

      <TabelRawatJalan
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialogRawatJalan
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

export default RawatJalanPage;