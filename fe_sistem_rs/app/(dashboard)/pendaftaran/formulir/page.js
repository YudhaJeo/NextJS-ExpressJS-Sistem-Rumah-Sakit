'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import TabelPendaftaran from './components/tabelPasien';
import FormDialogPendaftaran from './components/formDialogFormulir';
import HeaderBar from '@/app/components/headerbar';
import ToastNotifier from '@/app/components/toastNotifier';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [filterDate, setFilterDate] = useState(null);
  const [filterDateTime, setFilterDateTime] = useState(null);

  const [form, setForm] = useState({
    IDPENDAFTARAN: 0,
    NIK: '',
    NAMALENGKAP: '',
    TANGGALKUNJUNGAN: '',
    LAYANAN: 'Rawat Jalan',
    POLI: '',
    NAMADOKTER: '',
    KELUHAN: '',
    STATUSKUNJUNGAN: 'Diperiksa',
  });

  const [pasienOptions, setPasienOptions] = useState([]);

  const toastRef = useRef(null);
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
      const res = await axios.get(`${API_URL}/pasien`);
      const options = res.data.data.map((pasien) => ({
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
      const res = await axios.get(`${API_URL}/pendaftaran`);
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
          item.NIK.toLowerCase().includes(keyword.toLowerCase()) ||
          item.NAMALENGKAP.toLowerCase().includes(keyword.toLowerCase())
      );
      setData(filtered);
    }
  };

  const handleSubmit = async () => {
    const isEdit = !!form.IDPENDAFTARAN;
    const url = isEdit
      ? `${API_URL}/pendaftaran/${form.IDPENDAFTARAN}`
      : `${API_URL}/pendaftaran`;

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

  const handleEdit = (row) => {
    setForm({
      ...row,
      TANGGALKUNJUNGAN: row.TANGGALKUNJUNGAN?.split('T')[0] || '',
      NAMALENGKAP: row.NAMALENGKAP || '',
    });
    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    confirmDialog({
      message: `Apakah Anda yakin ingin menghapus data milik ${row.NAMALENGKAP}?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/pendaftaran/${row.IDPENDAFTARAN}`);
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
      KELUHAN: '',
      STATUSKUNJUNGAN: 'Diperiksa',
    });
  };

  const handleDateFilter = () => {
  if (!filterDate && !filterDateTime) {
    setData(originalData);
    return;
  }

  const filtered = originalData.filter((item) => {
    const visitDate = new Date(item.TANGGALKUNJUNGAN);

    const matchDate =
      filterDate &&
      visitDate.toISOString().split('T')[0] ===
        filterDate.toISOString().split('T')[0];

    const matchDateTime =
      filterDateTime &&
      visitDate.toISOString() === filterDateTime.toISOString();

    return matchDate || matchDateTime;
  });

  setData(filtered);
};

const resetFilter = () => {
  setFilterDate(null);
  setFilterDateTime(null);
  setData(originalData);
};

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Formulir Pendaftaran Kunjungan</h3>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
  {/* Filter Tanggal Kiri */}
  <div className="flex flex-wrap items-center gap-2">
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700">Tanggal Kunjungan</label>
      <Calendar
        value={filterDate}
        onChange={(e) => setFilterDate(e.value)}
        dateFormat="yy-mm-dd"
        showIcon
        className="w-[160px]"
        placeholder="Pilih tanggal"
      />
    </div>

    <div className="flex gap-2 items-end pt-[1.4rem]">
      <Button
        icon="pi pi-filter"
        label="Terapkan"
        severity="info"
        size="small"
        onClick={handleDateFilter}
      />
      <Button
        icon="pi pi-times"
        severity="secondary"
        size="small"
        onClick={resetFilter}
        tooltip="Reset Filter"
      />
    </div>
  </div>

  {/* HeaderBar kanan */}
  <HeaderBar
    title=""
    placeholder="Cari nama atau NIK..."
    onSearch={handleSearch}
    onAddClick={() => {
      resetForm();
      setDialogVisible(true);
    }}
  />
</div>

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
