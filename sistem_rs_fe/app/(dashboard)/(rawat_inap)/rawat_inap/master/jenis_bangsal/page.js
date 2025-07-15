// app/(dashboard)/master/jenis_bangsal/page.js
'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import HeaderBar from '@/app/components/headerbar';
import TabelJenis from './components/tabelJenisBangsal';
import FormDialog from './components/formDialogBangsal';
import ToastNotifier from '@/app/components/toastNotifier';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  const [form, setForm] = useState({
    NAMAJENIS: '',
    HARGA_PER_HARI: null,
    FASILITAS: '',
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
      const res = await axios.get(`${API_URL}/jenis_bangsal`);
      setData(res.data.data);
    } catch (err) {
      console.error('Gagal ambil data:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.NAMAJENIS.trim()) {
      newErrors.NAMAJENIS = (
        <span style={{ color: 'red' }}>Jenis bangsal wajib diisi</span>
      );
    }

    if (
      form.HARGA_PER_HARI === null ||
      form.HARGA_PER_HARI === undefined ||
      isNaN(form.HARGA_PER_HARI)
    ) {
      newErrors.HARGA_PER_HARI = (
        <span style={{ color: 'red' }}>Harga wajib diisi</span>
      );
    }

    if (!form.FASILITAS.trim()) {
      newErrors.FASILITAS = (
        <span style={{ color: 'red' }}>Fasilitas wajib diisi</span>
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const isEdit = !!form.IDJENISBANGSAL;
    const url = isEdit
      ? `${API_URL}/jenis_bangsal/${form.IDJENISBANGSAL}`
      : `${API_URL}/jenis_bangsal`;

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
      setForm({
        NAMAJENIS: '',
        HARGA_PER_HARI: null,
        FASILITAS: '',
      });
    } catch (err) {
      console.error('Gagal simpan data:', err);
      toastRef.current?.showToast('01', 'Gagal menyimpan data');
    }
  };

  const handleEdit = (row) => {
    setForm(row);
    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    confirmDialog({
      message: `Yakin hapus '${row.NAMAJENIS}'?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/jenis_bangsal/${row.IDJENISBANGSAL}`);
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

      <h3 className="text-xl font-semibold mb-3">Master Jenis Bangsal</h3>

      <HeaderBar
        title=""
        placeholder="Cari jenis bangsal"
        onSearch={(keyword) => {
          if (!keyword) return fetchData();
          const filtered = data.filter((item) =>
            item.NAMAJENIS.toLowerCase().includes(keyword.toLowerCase())
          );
          setData(filtered);
        }}
        onAddClick={() => {
          setForm({
            NAMAJENIS: '',
            HARGA_PER_HARI: null,
            FASILITAS: '',
          });
          setDialogVisible(true);
        }}
      />

      <TabelJenis
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialog
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          setForm({ NAMAJENIS: '' });
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
