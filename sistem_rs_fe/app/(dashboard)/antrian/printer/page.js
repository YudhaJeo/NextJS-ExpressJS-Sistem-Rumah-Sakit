'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import HeaderBar from '@/app/components/headerbar';
import ToastNotifier from '@/app/components/toastNotifier';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import TabelPrinter from './components/tabelPrinter';
import FormDialogPrinter from './components/formDialogPrinter';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  const [form, setForm] = useState({
    NAMAPRINTER: '',
    KODEPRINTER: '',
    KETERANGAN: '',
  });

  const [errors, setErrors] = useState({});
  const toastRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/printer`);
      setData(res.data.data);
      setOriginalData(res.data.data);
    } catch (err) {
      console.error('Gagal ambil data:', err);
      toastRef.current?.showToast('01', 'Gagal memuat data printer');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.NAMAPRINTER?.trim()) newErrors.NAMAPRINTER = 'Nama Printer wajib diisi';
    if (!form.KODEPRINTER?.trim()) newErrors.KODEPRINTER = 'Kode Printer wajib diisi';
    if (!form.KETERANGAN) newErrors.KETERANGAN = 'Status wajib dipilih';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = (keyword) => {
    if (!keyword) {
      setData(originalData);
    } else {
      const filtered = originalData.filter(
        (item) =>
          item.NAMAPRINTER.toLowerCase().includes(keyword.toLowerCase()) ||
          item.KODEPRINTER.toLowerCase().includes(keyword.toLowerCase())
      );
      setData(filtered);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const isEdit = !!form.NOPRINTER;
    const url = isEdit
      ? `${API_URL}/printer/${form.NOPRINTER}`
      : `${API_URL}/printer`;

    try {
      if (isEdit) {
        await axios.put(url, form);
        toastRef.current?.showToast('00', 'Data printer berhasil diperbarui');
      } else {
        await axios.post(url, form);
        toastRef.current?.showToast('00', 'Printer baru berhasil ditambahkan');
      }

      fetchData();
      setDialogVisible(false);
      resetForm();
    } catch (err) {
      console.error('Gagal simpan data:', err);
      toastRef.current?.showToast('01', 'Gagal menyimpan data printer');
    }
  };

  const handleEdit = (row) => {
    setForm({ ...row }); 
    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    confirmDialog({
      message: `Yakin ingin menghapus printer '${row.NAMAPRINTER}'?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/printer/${row.NOPRINTER}`);
          fetchData();
          toastRef.current?.showToast('00', 'Data printer berhasil dihapus');
        } catch (err) {
          console.error('Gagal hapus data:', err);
          toastRef.current?.showToast('01', 'Gagal menghapus data printer');
        }
      },
    });
  };

  const resetForm = () => {
    setForm({
      NAMAPRINTER: '',
      KODEPRINTER: '',
      KETERANGAN: '',
    });
    setErrors({});
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Data Printer</h3>

      <HeaderBar
        title=""
        placeholder="Cari berdasarkan Nama Printer atau Kode"
        onSearch={handleSearch}
        onAddClick={() => {
          resetForm();
          setDialogVisible(true);
        }}
      />

      <TabelPrinter
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialogPrinter
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