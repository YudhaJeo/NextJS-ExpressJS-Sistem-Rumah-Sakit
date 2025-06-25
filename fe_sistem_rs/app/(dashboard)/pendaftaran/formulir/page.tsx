'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

import TabelPendaftaran from './components/tabelPasien';
import FormDialogPendaftaran from './components/formDialogFormulir';
import HeaderBar from '@/components/headerbar';
import ToastNotifier, { ToastNotifierHandle } from '@/app/components/toastNotifier';
import { Pendaftaran } from '@/types/formulir';

import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const Page = () => {
  const [data, setData] = useState<Pendaftaran[]>([]);
  const [originalData, setOriginalData] = useState<Pendaftaran[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  const [form, setForm] = useState<Pendaftaran>({
    IDPENDAFTARAN: 0,
    NIK: '',
    NAMALENGKAP: '',
    TANGGALKUNJUNGAN: '',
    LAYANAN: 'Rawat Jalan',
    POLI: '',
    NAMADOKTER: '',
    STATUSKUNJUNGAN: 'Diperiksa',
  });

  const [pasienOptions, setPasienOptions] = useState<
    { label: string; value: string; NAMALENGKAP: string }[]
  >([]);

  const toastRef = useRef<ToastNotifierHandle>(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchData();
    fetchPasien();
  }, []);

  const fetchPasien = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/pasien');
      const options = res.data.data.map((pasien: any) => ({
        label: `${pasien.NIK} - ${pasien.NAMALENGKAP}`,
        value: pasien.NIK,
        NAMALENGKAP: pasien.NAMALENGKAP,
      }));
      setPasienOptions(options);
    } catch (err) {
      console.error('Gagal ambil data pasien:', err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:4000/api/pendaftaran');
      setData(res.data.data);
      setOriginalData(res.data.data);
    } catch (err) {
      console.error('Gagal ambil data:', err);
    } finally {
      setLoading(false);
    }
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
    const isEdit = !!form.IDPENDAFTARAN;
    const url = isEdit
      ? `http://localhost:4000/api/pendaftaran/${form.IDPENDAFTARAN}`
      : 'http://localhost:4000/api/pendaftaran';

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
      resetForm();
    } catch (err) {
      console.error('Gagal simpan data:', err);
      toastRef.current?.showToast('01', 'Gagal menyimpan data');
    }
  };

  const handleEdit = (row: Pendaftaran) => {
    setForm({
      ...row,
      TANGGALKUNJUNGAN: row.TANGGALKUNJUNGAN?.split('T')[0] || '',
      NAMALENGKAP: row.NAMALENGKAP || '',
    });
    setDialogVisible(true);
  };

  const handleDelete = (row: Pendaftaran) => {
    confirmDialog({
      message: 'Apakah Anda yakin ingin menghapus data ini?',
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`http://localhost:4000/api/pendaftaran/${row.IDPENDAFTARAN}`);
          fetchData();
          toastRef.current?.showToast('00', 'Data berhasil dihapus');
        } catch (err) {
          console.error('Gagal hapus data:', err);
          toastRef.current?.showToast('01', 'Gagal menghapus data');
        }
      },
    });
  };

  const resetForm = () => {
    setForm({
      IDPENDAFTARAN: 0,
      NAMALENGKAP: '',
      NIK: '',
      TANGGALKUNJUNGAN: '',
      LAYANAN: 'Rawat Jalan',
      POLI: '',
      NAMADOKTER: '',
      STATUSKUNJUNGAN: 'Diperiksa',
    });
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Formulir Pendaftaran Kunjungan</h3>

      <HeaderBar
        title=""
        placeholder="Cari nama atau NIK..."
        onSearch={handleSearch}
        onAddClick={() => setDialogVisible(true)}
      />

      <TabelPendaftaran
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialogPendaftaran
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
        }}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        pasienOptions={pasienOptions}
      />
    </div>
  );
};

export default Page;