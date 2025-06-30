'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import HeaderBar from '@/app/components/headerbar';
import ToastNotifier from '@/app/components/toastNotifier';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import TabelLoket from './components/tabelLoket';
import FormDialogLoket from './components/formDialogLoket';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  const [form, setForm] = useState({
    NAMALOKET: '',
    KODE: '',
    DESKRIPSI: '',
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
  const token = Cookies.get('token');

  try {
    const res = await axios.get(`${API_URL}/loket`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setData(res.data.data);
    setOriginalData(res.data.data);
  } catch (err) {
    console.error('Gagal ambil data:', err);
    toastRef.current?.showToast('01', 'Gagal mengambil data loket');
  } finally {
    setLoading(false);
  }
  };


  const validateForm = () => {
    const newErrors = {};

    if (!form.NAMALOKET?.trim()) newErrors.NAMALOKET = 'Nama Loket wajib diisi';
    if (!form.KODE?.trim()) newErrors.KODE = 'Kode wajib diisi';
    if (!form.DESKRIPSI?.trim()) newErrors.DESKRIPSI = 'Deskripsi wajib diisi';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = (keyword) => {
    if (!keyword) {
      setData(originalData);
    } else {
      const filtered = originalData.filter(
        (item) =>
          item.NAMALOKET.toLowerCase().includes(keyword.toLowerCase()) ||
          item.KODE.toLowerCase().includes(keyword.toLowerCase())
      );
      setData(filtered);
    }
  };

  const handleSubmit = async () => {
  if (!validateForm()) return;

  const isEdit = !!form.NO;
  const url = isEdit
    ? `${API_URL}/loket/${form.NO}`
    : `${API_URL}/loket`;

  const token = Cookies.get('token');

  try {
    if (isEdit) {
      await axios.put(url, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toastRef.current?.showToast('00', 'Data loket berhasil diperbarui');
    } else {
      await axios.post(url, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toastRef.current?.showToast('00', 'Loket baru berhasil ditambahkan');
    }

    fetchData();
    setDialogVisible(false);
    resetForm();
  } catch (err) {
    console.error('Gagal simpan data:', err);
    toastRef.current?.showToast('01', 'Gagal menyimpan data loket');
  }
  };

  const handleEdit = (row) => {
    setForm(row);
    setDialogVisible(true);
  };

  const handleDelete = (row) => {
  const token = Cookies.get('token');

  confirmDialog({
    message: `Yakin ingin menghapus loket '${row.NAMALOKET}'?`,
    header: 'Konfirmasi Hapus',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Ya',
    rejectLabel: 'Batal',
    accept: async () => {
      try {
        await axios.delete(`${API_URL}/loket/${row.NO}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchData();
        toastRef.current?.showToast('00', 'Data loket berhasil dihapus');
      } catch (err) {
        console.error('Gagal hapus data:', err);
        toastRef.current?.showToast('01', 'Gagal menghapus data loket');
      }
    },
  });
  };


  const resetForm = () => {
    setForm({
      NAMALOKET: '',
      KODE: '',
      DESKRIPSI: '',
    });
    setErrors({});
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Master Loket</h3>

      <HeaderBar
        title=""
        placeholder="Cari berdasarkan Nama Loket atau Kode"
        onSearch={handleSearch}
        onAddClick={() => {
          resetForm();
          setDialogVisible(true);
        }}
      />

      <TabelLoket data={data} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />

      <FormDialogLoket
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
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