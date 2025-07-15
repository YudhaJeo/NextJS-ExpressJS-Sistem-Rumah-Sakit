// app\(dashboard)\(rawat_inap)\rawat_inap\master\tindakan_medis\page.js
'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import HeaderBar from '@/app/components/headerbar';
import MyTabel from './components/tabelTindakan';
import MyForm from './components/formTindakan';
import ToastNotifier from '@/app/components/toastNotifier';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const defaultForm = {
  IDTINDAKAN: '',
  NAMATINDAKAN: '',
  KATEGORI: '',
  HARGA: null,
  DESKRIPSI: ''
};

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [form, setForm] = useState(defaultForm);
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
      const res = await axios.get(`${API_URL}/tindakan_medis`);
      setData(res.data.data);
    } catch (err) {
      console.error('Gagal ambil data:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!(form.NAMATINDAKAN || '').trim())
      newErrors.NAMATINDAKAN = (
    <span style={{ color: 'red' }}>Nama tindakan wajib diisi</span>
      );
    if (
      form.HARGA === null ||
      form.HARGA === undefined ||
      isNaN(form.HARGA)
    ) {
      newErrors.HARGA = (
        <span style={{ color: 'red' }}>Harga wajib diisi</span>
      );
    }

    if (!(form.KATEGORI || '').trim())
      newErrors.KATEGORI = (
        <span style={{ color: 'red' }}>Satuan tindakan wajib diisi</span>
      );


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const isEdit = !!form.IDTINDAKAN;
    const url = isEdit
      ? `${API_URL}/tindakan_medis/${form.IDTINDAKAN}`
      : `${API_URL}/tindakan_medis`;

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
      IDTINDAKAN: row.IDTINDAKAN, 
      NAMATINDAKAN: row.NAMATINDAKAN || '', 
      KATEGORI: row.KATEGORI || '',
      HARGA: row.HARGA ?? 0,
      DESKRIPSI: row.DESKRIPSI || ''
    });
    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    confirmDialog({
      message: `Yakin hapus '${row.NAMATINDAKAN}'?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/tindakan_medis/${row.IDTINDAKAN}`);
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

      <h3 className="text-xl font-semibold mb-3">Master Data Tindakan Medis</h3>

      <HeaderBar
        title=""
        placeholder="Cari nama tindakan"
        onSearch={(keyword) => {
          if (!keyword) return fetchData();
          const filtered = data.filter((item) =>
            item.NAMATINDAKAN.toLowerCase().includes(keyword.toLowerCase()) ||
            item.KATEGORI.toLowerCase().includes(keyword.toLowerCase())
          );
          setData(filtered);
        }}
        onAddClick={() => {
          setForm(defaultForm);
          setDialogVisible(true);
        }}
      />

      <MyTabel
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <MyForm
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
