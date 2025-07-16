'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import HeaderBar from '@/app/components/headerbar';
import TabelMetodePembayaran from './components/tabelMetodePembayaran';
import FormDialogMetodePembayaran from './components/formDialogMetodePembayaran';
import ToastNotifier from '@/app/components/toastNotifier';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  const [form, setForm] = useState({
    IDMETODE: null,
    NAMA: '',
    STATUS: 'AKTIF',
    CATATAN: '',
    FEE_PERSEN: 0,
  });

  const [errors, setErrors] = useState({});
  const toastRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/metode_pembayaran`);
      setData(res.data.data);
      setOriginalData(res.data.data);
    } catch (err) {
      console.error('Gagal ambil data:', err);
      toastRef.current?.showToast('01', 'Gagal mengambil data metode pembayaran');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (keyword) => {
    if (!keyword) {
      setData(originalData);
    } else {
      const filtered = originalData.filter(
        (item) =>
          item.NAMA.toLowerCase().includes(keyword.toLowerCase())
      );
      setData(filtered);
    }
  };

  const handleSubmit = async () => {
    const payload = {
      NAMA: form.NAMA,
      STATUS: form.STATUS,
      CATATAN: form.CATATAN,
      FEE_PERSEN: form.FEE_PERSEN,
    };

    const isEdit = !!form.IDMETODE;
    const url = isEdit
      ? `${API_URL}/metode_pembayaran/${form.IDMETODE}`
      : `${API_URL}/metode_pembayaran`;

    try {
      if (isEdit) {
        await axios.put(url, payload);
        toastRef.current?.showToast('00', 'Metode pembayaran berhasil diperbarui');
      } else {
        await axios.post(url, payload);
        toastRef.current?.showToast('00', 'Metode pembayaran berhasil ditambahkan');
      }

      fetchData();
      setDialogVisible(false);
      resetForm();
    } catch (err) {
      console.error('Gagal simpan data:', err);
      toastRef.current?.showToast('01', 'Gagal menyimpan data metode pembayaran');
    }
  };

  const handleEdit = (row) => {
    setForm({
      IDMETODE: row.IDMETODE ?? null,
      NAMA: row.NAMA ?? '',
      STATUS: row.STATUS ?? 'AKTIF',
      CATATAN: row.CATATAN ?? '',
      FEE_PERSEN: row.FEE_PERSEN ?? 0,
    });
    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    confirmDialog({
      message: `Hapus metode pembayaran '${row.NAMA}'?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/metode_pembayaran/${row.IDMETODE}`);
          fetchData();
          toastRef.current?.showToast('00', 'Metode pembayaran berhasil dihapus');
        } catch (err) {
          console.error('Gagal hapus data:', err);
          toastRef.current?.showToast('01', 'Gagal menghapus metode pembayaran');
        }
      },
    });
  };

  const resetForm = () => {
    setForm({
      IDMETODE: null,
      NAMA: '',
      TIPE: '',
      STATUS: 'AKTIF',
      CATATAN: '',
      FEE_PERSEN: 0,
      IDBANK: null,
    });
    setErrors({});
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />

      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Master Metode Pembayaran</h3>
      
      <HeaderBar
        title=""
        placeholder="Cari Nama Metode"
        onSearch={handleSearch}
        onAddClick={() => {
          resetForm();
          setDialogVisible(true);
        }}
      />

      <TabelMetodePembayaran
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialogMetodePembayaran
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

export default Page;