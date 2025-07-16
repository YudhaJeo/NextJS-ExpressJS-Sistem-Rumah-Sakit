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

const DataDokterPage = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [formData, setFormData] = useState({
    IDDATA: 0,
    IDDOKTER: "",
    IDPOLI: "",
    IDJADWAL: "",
    NO_TELEPON: "",
    EMAIL: "",
    ALAMAT: "",
    JENIS_KELAMIN: "",
  });

  const [dokterOptions, setDokterOptions] = useState([]);
  const [poliOptions, setPoliOptions] = useState([]);
  const [jadwalOptions, setJadwalOptions] = useState([]);
  const [allJadwal, setAllJadwal] = useState([]);
  const toastRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchData();
    fetchDropdowns();
  }, []);

  const fetchData = async () => {
  setLoading(true);
  try {
    const [dokterData, jadwalData] = await Promise.all([
      axios.get(`${API_URL}/data_dokter`),
      axios.get(`${API_URL}/jadwal_dokter`),
    ]);

    const merged = dokterData.data.map((dokter) => ({
      ...dokter,
      JADWAL: jadwalData.data.filter((j) => j.IDDOKTER === dokter.IDDOKTER),
    }));

    setData(merged);
    setOriginalData(merged);
  } catch (err) {
    console.error("Gagal ambil data dokter atau jadwal:", err);
  } finally {
    setLoading(false);
  }
};

  const fetchDropdowns = async () => {
    try {
      const [dokter, poli, jadwal] = await Promise.all([
        axios.get(`${API_URL}/dokter`),
        axios.get(`${API_URL}/poli`),
        axios.get(`${API_URL}/jadwal_dokter`),
      ]);

      setDokterOptions(dokter.data.map((d) => ({ label: d.NAMADOKTER, value: d.IDDOKTER })));
      setPoliOptions(poli.data.map((p) => ({ label: p.NAMAPOLI, value: p.IDPOLI })));
      setAllJadwal(jadwal.data);
    } catch (err) {
      console.error("Gagal ambil data dropdown:", err);
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
      IDPOLI,
      IDJADWAL,
      NO_TELEPON,
      EMAIL,
      ALAMAT,
      JENIS_KELAMIN,
    } = formData;

    if (!IDDOKTER || !IDPOLI || !IDJADWAL || !NO_TELEPON || !EMAIL || !ALAMAT || !JENIS_KELAMIN) {
      toastRef.current?.showToast("01", "Field wajib tidak boleh kosong!");
      return;
    }

    const isEdit = !!formData.IDDATA;
    const url = isEdit
      ? `${API_URL}/data_dokter/${formData.IDDATA}`
      : `${API_URL}/data_dokter`;

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
          await axios.delete(`${API_URL}/data_dokter/${row.IDDATA}`);
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
      IDDATA: 0,
      IDDOKTER: "",
      IDPOLI: "",
      IDJADWAL: "",
      NO_TELEPON: "",
      EMAIL: "",
      ALAMAT: "",
      JENIS_KELAMIN: "",
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

      <TabelData
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialogData
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
        }}
        onChange={setFormData}
        onSubmit={handleSubmit}
        formData={formData}
        dokterOptions={dokterOptions}
        poliOptions={poliOptions}
        jadwalOptions={jadwalOptions}
        allJadwal={allJadwal}
      />
    </div>
  );
};

export default DataDokterPage;
