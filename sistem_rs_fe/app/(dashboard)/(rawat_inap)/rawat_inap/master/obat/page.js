'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import HeaderBar from '@/app/components/headerbar';
import TabelObat from './components/tabelObat';
import FormObat from './components/formObat';
import ToastNotifier from '@/app/components/toastNotifier';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const defaultForm = {
  IDOBAT: '',
  NAMAOBAT: '',
  SATUAN: '',
  STOK: 0,
  HARGA: null,
  KETERANGAN: ''
};

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  const toastRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/obat`);
      setData(res.data.data);
    } catch (err) {
      console.error('Gagal ambil data:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!(form.NAMAOBAT || '').trim())
      newErrors.NAMAOBAT = (
        <span style={{ color: 'red' }}>Nama obat wajib diisi</span>
      );

    if (!(form.SATUAN || '').trim())
      newErrors.SATUAN = (
        <span style={{ color: 'red' }}>Satuan obat wajib diisi</span>
      );

    if (
      form.STOK === null ||
      form.STOK === undefined ||
      isNaN(form.STOK)
    ) {
      newErrors.STOK = (
        <span style={{ color: 'red' }}>Stok wajib diisi</span>
      );
    }

    if (
      form.HARGA === null ||
      form.HARGA === undefined ||
      isNaN(form.HARGA)
    ) {
      newErrors.HARGA = (
        <span style={{ color: 'red' }}>Harga wajib diisi</span>
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const isEdit = !!form.IDOBAT;
    const url = isEdit
      ? `${API_URL}/obat/${form.IDOBAT}`
      : `${API_URL}/obat`;

    try {
      if (isEdit) {
        await axios.put(url, form);
        toastRef.current?.showToast('00', 'Data berhasil diperbarui');
      } else {
        await axios.post(url, form);
        toastRef.current?.showToast('00', 'Data berhasil ditambahkan');
      }

      fetchData();
      setDialogVisible(false);
      setForm(defaultForm);
    } catch (err) {
      console.error('Gagal simpan data:', err);
      toastRef.current?.showToast('01', 'Gagal menyimpan data');
    }
  };

  const handleEdit = (row) => {
    setForm({
      IDOBAT: row.IDOBAT,
      NAMAOBAT: row.NAMAOBAT || '',
      SATUAN: row.SATUAN || '',
      STOK: row.STOK ?? 0,
      HARGA: row.HARGA ?? 0,
      KETERANGAN: row.KETERANGAN || ''
    });
    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    confirmDialog({
      message: `Yakin hapus '${row.NAMAOBAT}'?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/obat/${row.IDOBAT}`);
          fetchData();
          toastRef.current?.showToast('00', 'Data berhasil dihapus');
        } catch (err) {
          console.error('Gagal hapus data:', err);
          toastRef.current?.showToast('01', 'Gagal menghapus data');
        }
      },
    });
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Master Data Obat</h3>

      <HeaderBar
        title=""
        placeholder="Cari nama obat"
        onSearch={(keyword) => {
          if (!keyword) return fetchData();
          const filtered = data.filter((item) =>
            item.NAMAOBAT.toLowerCase().includes(keyword.toLowerCase()) ||
            item.SATUAN.toLowerCase().includes(keyword.toLowerCase())
          );
          setData(filtered);
        }}
        onAddClick={() => {
          setForm(defaultForm);
          setDialogVisible(true);
        }}
      />

      <TabelObat
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormObat
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          setForm(defaultForm);
        }}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        errors={errors}
      />
    </div>
  );
};

export default Page;
