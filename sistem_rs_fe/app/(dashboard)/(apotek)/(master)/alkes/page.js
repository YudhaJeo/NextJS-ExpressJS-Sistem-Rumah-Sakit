"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import HeaderBar from "@/app/components/headerbar";
import TabelAlkes from "./components/tabelAlkes";
import FormAlkes from "./components/formAlkes";
import ToastNotifier from "@/app/components/toastNotifier";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const defaultForm = {
  IDALKES: '',
  KODEALKES: '',
  NAMAALKES: '',
  MERKALKES: '',
  JENISALKES: '',
  STOK: 0,
  HARGABELI: null,
  HARGAJUAL: null,
  TGLKADALUARSA: '',
  LOKASI: '',
  SUPPLIERID: null,
  KETERANGAN: '',
};

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [supplierOptions, setSupplierOptions] = useState([]);

  const toastRef = useRef(null);

  useEffect(() => {
    fetchData();
    fetchSuppliers();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/alkes`);
      setData(res.data.data);
    } catch (err) {
      console.error("Gagal ambil data alkes:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(`${API_URL}/supplier`);
      const options = res.data.map((item) => ({
        label: item.NAMASUPPLIER,
        value: item.SUPPLIERID,
      }));
      setSupplierOptions(options);
    } catch (err) {
      console.error("Gagal ambil data supplier:", err);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.KODEALKES.trim()) newErrors.KODEALKES = "Kode alkes wajib diisi";
    if (!form.NAMAALKES.trim()) newErrors.NAMAALKES = "Nama alkes wajib diisi";
    if (!form.MERKALKES.trim()) newErrors.MERKALKES = "Merk wajib diisi";
    if (!form.JENISALKES.trim()) newErrors.JENISALKES = "Jenis wajib diisi";
    if (form.STOK === null || isNaN(form.STOK)) newErrors.STOK = "Stok wajib diisi";
    if (form.HARGABELI === null || isNaN(form.HARGABELI)) newErrors.HARGABELI = "Harga beli wajib diisi";
    if (form.HARGAJUAL === null || isNaN(form.HARGAJUAL)) newErrors.HARGAJUAL = "Harga jual wajib diisi";
    if (!form.TGLKADALUARSA.trim()) newErrors.TGLKADALUARSA = "Tanggal kadaluarsa wajib diisi";
    if (!form.LOKASI.trim()) newErrors.LOKASI = "Lokasi wajib diisi";
    if (!form.SUPPLIERID) newErrors.SUPPLIERID = "Supplier wajib dipilih";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const isEdit = !!form.IDALKES;
    const url = isEdit
      ? `${API_URL}/alkes/${form.IDALKES}`
      : `${API_URL}/alkes`;

    try {
      if (isEdit) {
        await axios.put(url, form);
        toastRef.current?.showToast("00", "Data berhasil diperbarui");
      } else {
        await axios.post(url, form);
        toastRef.current?.showToast("00", "Data berhasil ditambahkan");
      }

      fetchData();
      setDialogVisible(false);
      setForm(defaultForm);
    } catch (err) {
      console.error("Gagal simpan data alkes:", err);
      toastRef.current?.showToast("01", "Gagal menyimpan data");
    }
  };

  const handleEdit = (row) => {
    setForm({
      IDALKES: row.IDALKES,
      KODEALKES: row.KODEALKES || '',
      NAMAALKES: row.NAMAALKES || '',
      MERKALKES: row.MERKALKES || '',
      JENISALKES: row.JENISALKES || '',
      STOK: row.STOK ?? 0,
      HARGABELI: row.HARGABELI ?? 0,
      HARGAJUAL: row.HARGAJUAL ?? 0,
      TGLKADALUARSA: row.TGLKADALUARSA || '',
      LOKASI: row.LOKASI || '',
      SUPPLIERID: row.SUPPLIERID ?? null,
      KETERANGAN: row.KETERANGAN || '',
    });
    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    confirmDialog({
      message: `Yakin hapus '${row.NAMAALKES}'?`,
      header: "Konfirmasi Hapus",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Ya",
      rejectLabel: "Batal",
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/alkes/${row.IDALKES}`);
          fetchData();
          toastRef.current?.showToast("00", "Data berhasil dihapus");
        } catch (err) {
          console.error("Gagal hapus data alkes:", err);
          toastRef.current?.showToast("01", "Gagal menghapus data");
        }
      },
    });
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Master Data Alat Kesehatan</h3>

      <HeaderBar
        title=""
        placeholder="Cari nama alat kesehatan"
        onSearch={(keyword) => {
          if (!keyword) return fetchData();
          const filtered = data.filter(
            (item) =>
              item.NAMAALKES.toLowerCase().includes(keyword.toLowerCase()) ||
              item.JENISALKES.toLowerCase().includes(keyword.toLowerCase())
          );
          setData(filtered);
        }}
        onAddClick={() => {
          setForm(defaultForm);
          setDialogVisible(true);
        }}
      />

      <TabelAlkes
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormAlkes
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          setForm(defaultForm);
        }}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        errors={errors}
        supplierOptions={supplierOptions}
      />
    </div>
  );
};

export default Page;