'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import HeaderBar from '@/app/components/headerbar';
import TabelBankAccount from './components/tabelBankAccount';
import FormDialogBankAccount from './components/formDialogBankAccount';
import ToastNotifier from '@/app/components/toastNotifier';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  const [form, setForm] = useState({
    NAMA_BANK: '',
    NO_REKENING: '',
    ATAS_NAMA: '',
    CABANG: '',
    KODE_BANK: '',
    STATUS: 'AKTIF',
    CATATAN: '',
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
      const res = await axios.get(`${API_URL}/bank_account`);
      setData(res.data.data);
      setOriginalData(res.data.data);
    } catch (err) {
      console.error('Gagal ambil data:', err);
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
          item.NAMA_BANK.toLowerCase().includes(keyword.toLowerCase()) ||
          item.NO_REKENING.toLowerCase().includes(keyword.toLowerCase()) ||
          item.ATAS_NAMA.toLowerCase().includes(keyword.toLowerCase())
      );
      setData(filtered);
    }
  };

  const handleSubmit = async () => {
    const isEdit = !!form.IDBANK;
    const url = isEdit
      ? `${API_URL}/bank_account/${form.IDBANK}`
      : `${API_URL}/bank_account`;

    try {
      if (isEdit) {
        await axios.put(url, form);
        toastRef.current?.showToast('00', 'Rekening bank berhasil diperbarui');
      } else {
        await axios.post(url, form);
        toastRef.current?.showToast('00', 'Rekening bank berhasil ditambahkan');
      }

      fetchData();
      setDialogVisible(false);
      resetForm();
    } catch (err) {
      console.error('Gagal simpan data:', err);
      toastRef.current?.showToast('01', 'Gagal menyimpan data rekening');
    }
  };

  const handleEdit = (row) => {
    setForm(row);
    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    confirmDialog({
      message: `Apakah Anda yakin ingin menghapus rekening '${row.NAMA_BANK}'?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/bank_account/${row.IDBANK}`);
          fetchData();
          toastRef.current?.showToast('00', 'Rekening bank berhasil dihapus');
        } catch (err) {
          console.error('Gagal hapus data:', err);
          toastRef.current?.showToast('01', 'Gagal menghapus data rekening');
        }
      },
    });
  };

  const resetForm = () => {
    setForm({
      NAMA_BANK: '',
      NO_REKENING: '',
      ATAS_NAMA: '',
      CABANG: '',
      KODE_BANK: '',
      STATUS: 'AKTIF',
      CATATAN: '',
    });
    setErrors({});
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />
      <h3 className="text-xl font-semibold mb-3">Master Rekening Bank</h3>
      <HeaderBar
        title=""
        placeholder="Cari Nama Bank / Rekening / Atas Nama"
        onSearch={handleSearch}
        onAddClick={() => {
          resetForm();
          setDialogVisible(true);
        }}
      />

      <TabelBankAccount
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialogBankAccount
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