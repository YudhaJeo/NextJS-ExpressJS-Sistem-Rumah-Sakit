'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

import HeaderBar from '@/app/components/headerbar';
import TabelPasien from './components/tabelPasien';
import FormDialogPasien from './components/formDialogPasien';
import ToastNotifier, { ToastNotifierHandle } from '@/app/components/toastNotifier';

import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Pasien } from '@/types/pasien';

const Page = () => {
  const [data, setData] = useState<Pasien[]>([]);
  const [originalData, setOriginalData] = useState<Pasien[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  const [form, setForm] = useState<Pasien>({
    NIK: '',
    NAMALENGKAP: '',
    TANGGALLAHIR: '',
    JENISKELAMIN: 'L',
    ASURANSI: 'Umum',
    ALAMAT: '',
    NOHP: '',
    AGAMA: '',
    GOLDARAH: '',
    NOASURANSI: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const toastRef = useRef<ToastNotifierHandle>(null);
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
      const res = await axios.get('http://localhost:4000/api/pasien');
      setData(res.data.data);
      setOriginalData(res.data.data);
    } catch (err) {
      console.error('Gagal ambil data:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.NAMALENGKAP.trim()) newErrors.NAMALENGKAP = 'Nama wajib diisi';
    if (!form.NIK.trim()) {
      newErrors.NIK = 'NIK wajib diisi';
    } else if (!/^\d{16}$/.test(form.NIK)) {
      newErrors.NIK = 'NIK harus 16 digit angka';
    }

    if (!form.TANGGALLAHIR) newErrors.TANGGALLAHIR = 'Tanggal lahir wajib diisi';
    if (!form.JENISKELAMIN) newErrors.JENISKELAMIN = 'Jenis kelamin wajib dipilih';
    if (!form.ALAMAT?.trim()) newErrors.ALAMAT = 'Alamat wajib diisi';
    if (!form.NOHP?.trim()) {
      newErrors.NOHP = 'No HP wajib diisi';
    } else if (!/^\d+$/.test(form.NOHP)) {
      newErrors.NOHP = 'No HP hanya boleh berisi angka';
    }

    if (!form.AGAMA?.trim()) newErrors.AGAMA = 'Agama wajib diisi';
    if (!form.GOLDARAH) newErrors.GOLDARAH = 'Golongan darah wajib dipilih';
    if (!form.ASURANSI) newErrors.ASURANSI = 'Asuransi wajib dipilih';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = (keyword: string) => {
    if (!keyword) {
      setData(originalData);
    } else {
      const filtered = originalData.filter(
        (item) =>
          item.NIK.toLowerCase().includes(keyword.toLowerCase()) ||
          item.NAMALENGKAP.toLowerCase().includes(keyword.toLowerCase())
      );
      setData(filtered);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const isEdit = !!form.IDPASIEN;
    const url = isEdit
      ? `http://localhost:4000/api/pasien/${form.IDPASIEN}`
      : 'http://localhost:4000/api/pasien';

    try {
      const payload = {
        ...form,
        TANGGALLAHIR: form.TANGGALLAHIR,
      };

      if (isEdit) {
        await axios.put(url, payload);
        toastRef.current?.showToast('00', 'Data pasien berhasil diperbarui');
      } else {
        await axios.post(url, payload);
        toastRef.current?.showToast('00', 'Pasien baru berhasil didaftarkan');
      }

      fetchData();
      setDialogVisible(false);
      resetForm();
    } catch (err) {
      console.error('Gagal simpan data:', err);
      toastRef.current?.showToast('01', 'Gagal menyimpan data pasien');
    }
  };

  const handleEdit = (row: Pasien) => {
    const formattedTanggal = row.TANGGALLAHIR
      ? new Date(row.TANGGALLAHIR).toISOString().split('T')[0]
      : '';

    setForm({
      ...row,
      TANGGALLAHIR: formattedTanggal,
    });

    setDialogVisible(true);
  };

  const handleDelete = (row: Pasien) => {
    confirmDialog({
      message: `Apakah Anda yakin ingin menghapus pasien '${row.NAMALENGKAP}'?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`http://localhost:4000/api/pasien/${row.IDPASIEN}`);
          fetchData();
          toastRef.current?.showToast('00', 'Data pasien berhasil dihapus');
        } catch (err) {
          console.error('Gagal hapus data:', err);
          toastRef.current?.showToast('01', 'Gagal menghapus data pasien');
        }
      },
    });
  };

  const resetForm = () => {
    setForm({
      NIK: '',
      NAMALENGKAP: '',
      TANGGALLAHIR: '',
      JENISKELAMIN: 'L',
      ASURANSI: 'Umum',
      ALAMAT: '',
      NOHP: '',
      AGAMA: '',
      GOLDARAH: '',
      NOASURANSI: '',
    });
    setErrors({});
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Master Data Pasien</h3>

      <HeaderBar
        title=""
        placeholder="Cari berdasarkan NIK atau Nama"
        onSearch={handleSearch}
        onAddClick={() => {
          resetForm();
          setDialogVisible(true);
        }}
      />

      <TabelPasien data={data} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />

      <FormDialogPasien
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