// app/(dashboard)/(rawatinap)/rawatinap/manajemen-bed/page.js
'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import HeaderBar from '@/app/components/headerbar';
import TabelBed from './components/tabelBed';
import FormBed from './components/formBed';
import ToastNotifier from '@/app/components/toastNotifier';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const router = useRouter();
  const toastRef = useRef(null);

  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [bangsalOptions, setBangsalOptions] = useState([]);

  const [form, setForm] = useState({
    IDBED: '',
    NOMORBED: '',
    IDKAMAR: '',
    STATUS: '',
    KETERANGAN: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchData();
    fetchKamar();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/bed`);
      setData(res.data.data);
      setOriginalData(res.data.data);
    } catch (err) {
      console.error('Gagal ambil data bed:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchKamar = async () => {
    try {
      const res = await axios.get(`${API_URL}/kamar`);
      const options = res.data.data.map((item) => ({
        label: `${item.IDKAMAR} - ${item.NAMAKAMAR}`,
        value: item.IDKAMAR,
      }));
      setBangsalOptions(options);
    } catch (err) {
      console.error('Gagal ambil kamar:', err);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.NOMORBED?.trim()) {
      newErrors.NAMAKAMAR = 'Nama bed wajib diisi';
    }

    if (!form.IDKAMAR) {
      newErrors.IDKAMAR = 'Kamar wajib dipilih';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setForm({
      IDBED: '',
      NOMORBED: '',
      IDKAMAR: '',
      STATUS: '',
      KETERANGAN: '',
    });
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const isEdit = !!form.IDBED;
    const url = isEdit
      ? `${API_URL}/bed/${form.IDBED}`
      : `${API_URL}/bed`;

    try {
      if (isEdit) {
        await axios.put(url, form);
        toastRef.current?.showToast('00', 'Data bed berhasil diperbarui');
      } else {
        await axios.post(url, form);
        toastRef.current?.showToast('00', 'Data bed berhasil ditambahkan');
      }

      fetchData();
      setDialogVisible(false);
      resetForm();
    } catch (err) {
      console.error('Gagal simpan data bed:', err);
      toastRef.current?.showToast('01', 'Gagal menyimpan data bed');
    }
  };

  const handleEdit = (row) => {
    setForm({ ...row });
    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    confirmDialog({
      message: `Apakah Anda yakin ingin menghapus bed '${row.NAMAKAMAR}'?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/bed/${row.IDKAMAR}`);
          fetchData();
          toastRef.current?.showToast('00', 'Data bed berhasil dihapus');
        } catch (err) {
          console.error('Gagal hapus bed:', err);
          toastRef.current?.showToast('01', 'Gagal menghapus data bed');
        }
      },
    });
  };

  const handleSearch = (keyword) => {
    if (!keyword) {
      setData(originalData);
    } else {
      const filtered = originalData.filter((item) =>
        item.NAMAKAMAR.toLowerCase().includes(keyword.toLowerCase())
      );
      setData(filtered);
    }
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Manajemen Data Bed</h3>

      <HeaderBar
        title=""
        placeholder="Cari nama bed"
        onSearch={handleSearch}
        onAddClick={() => {
          resetForm();
          setDialogVisible(true);
        }}
      />

      <TabelBed
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormBed
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
        }}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        errors={errors}
        bangsalOptions={bangsalOptions}
      />
    </div>
  );
};

export default Page;