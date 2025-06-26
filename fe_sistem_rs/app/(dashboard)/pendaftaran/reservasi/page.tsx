//page
'use client';

import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { Reservasi } from '@/types/reservasi';
import TabelReservasiPasien from './components/tabelReservasi';
import FormReservasiPasien from './components/formReservasi';
import HeaderBar from '@/app/components/headerbar';
import ToastNotifier, { ToastNotifierHandle } from '@/app/components/toastNotifier';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const ReservasiPasienPage = () => {
  const [data, setData] = useState<Reservasi[]>([]);
  const [originalData, setOriginalData] = useState<Reservasi[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  const [formData, setFormData] = useState<Reservasi>({
    IDRESERVASI: 0,
    NIK: '',
    POLI: '',
    NAMADOKTER: '',
    TANGGALRESERVASI: '',
    JAMRESERVASI: '',
    STATUS: 'Menunggu',
    KETERANGAN: '',
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

    fetchReservasi();
    fetchPasien();
  }, []);

const fetchReservasi = async () => {
  setLoading(true);
  try {
    const res = await axios.get('http://localhost:4000/api/reservasi');
    console.log('Data reservasi API:', res.data);
    setData(res.data); // res.data langsung array
    setOriginalData(res.data);
  } catch (err) {
    console.error('Gagal mengambil data:', err);
  } finally {
    setLoading(false);
  }
};

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

  const handleSearch = (keyword: string) => {
    if (!keyword) {
      setData(originalData);
    } else {
      const filtered = originalData.filter(
        (item) =>
          item.NIK.toLowerCase().includes(keyword.toLowerCase()) ||
          item.NAMADOKTER.toLowerCase().includes(keyword.toLowerCase())
      );
      setData(filtered);
    }
  };

  const handleSubmit = async () => {
    if (!formData.NIK || !formData.POLI || !formData.NAMADOKTER || !formData.TANGGALRESERVASI || !formData.JAMRESERVASI || !formData.STATUS) {
      toastRef.current?.showToast('01', 'Semua field wajib diisi!');
      return;
    }

    const isEdit = !!formData.IDRESERVASI;
    const url = isEdit
      ? `http://localhost:4000/api/reservasi/${formData.IDRESERVASI}`
      : 'http://localhost:4000/api/reservasi';

    try {
      if (isEdit) {
        await axios.put(url, formData);
        toastRef.current?.showToast('00', 'Data berhasil diperbarui');
      } else {
        await axios.post(url, formData);
        toastRef.current?.showToast('00', 'Data berhasil ditambahkan');
      }
      fetchReservasi();
      setDialogVisible(false);
      resetForm();
    } catch (err) {
      console.error('Gagal menyimpan data:', err);
      toastRef.current?.showToast('01', 'Gagal menyimpan data');
    }
  };

  const handleEdit = (row: Reservasi) => {
    setFormData({
      ...row,
      TANGGALRESERVASI: row.TANGGALRESERVASI?.split('T')[0] || '',
    });
    setDialogVisible(true);
  };

  const handleDelete = (row: Reservasi) => {
    confirmDialog({
      message: `Apakah Anda yakin ingin menghapus data milik ${row.IDRESERVASI}?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`http://localhost:4000/api/reservasi/${row.IDRESERVASI}`);
          fetchReservasi();
          toastRef.current?.showToast('00', 'Data berhasil dihapus');
        } catch (err) {
          console.error('Gagal menghapus data:', err);
          toastRef.current?.showToast('01', 'Gagal menghapus data');
        }
      },
    });
  };

  const resetForm = () => {
    setFormData({
      IDRESERVASI: 0,
      NIK: '',
      POLI: '',
      NAMADOKTER: '',
      TANGGALRESERVASI: '',
      JAMRESERVASI: '',
      STATUS: 'Menunggu',
      KETERANGAN: '',
    });
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Reservasi Pasien</h3>

      <HeaderBar
        title=""
        placeholder="Cari NIK atau Nama Dokter..."
        onSearch={handleSearch}
        onAddClick={() => setDialogVisible(true)}
      />

      <TabelReservasiPasien
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormReservasiPasien
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
        }}
        onChange={setFormData}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        pasienOptions={pasienOptions}
      />
    </div>
  );
};

export default ReservasiPasienPage;
