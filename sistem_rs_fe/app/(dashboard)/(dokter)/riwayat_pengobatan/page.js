'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import TabelPengobatan from './components/tabelRiwayat'; 
import FormDialogPengobatan from './components/formDialogRiwayat';
import HeaderBar from '@/app/components/headerbar';
import ToastNotifier from '@/app/components/toastNotifier';
import FilterTanggal from '@/app/components/filterTanggal';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [pendaftaranOptions, setPendaftaranOptions] = useState([]);
  const [form, setForm] = useState({
    IDPENGOBATAN: 0,
    IDPENDAFTARAN: '',
    NIK: '',
    NAMALENGKAP: '',
    TANGGALKUNJUNGAN: '',
    KELUHAN: '',
    POLI: '',
    STATUSKUNJUNGAN: 'Diperiksa',
    STATUSRAWAT: 'Rawat Jalan',
    DIAGNOSA: '',
    OBAT: '',
  });

  const toastRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchData();
    fetchPendaftaran();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/riwayatpengobatan`);
      setData(res.data.data);
      setOriginalData(res.data.data);
    } catch (err) {
      console.error('Gagal ambil data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendaftaran = async () => {
  try {
    const res = await axios.get(`${API_URL}/pendaftaran`);
    const options = res.data.data.map((pendaftaran) => ({
      label: `${pendaftaran.NIK} - ${pendaftaran.NAMALENGKAP}`,
      value: pendaftaran.NIK,
      IDPENDAFTARAN: pendaftaran.IDPENDAFTARAN,
      NAMALENGKAP: pendaftaran.NAMALENGKAP,
      TANGGALKUNJUNGAN: pendaftaran.TANGGALKUNJUNGAN?.split('T')[0] || '',
      KELUHAN: pendaftaran.KELUHAN,
      POLI: pendaftaran.NAMAPOLI || '',
      IDPOLI: pendaftaran.IDPOLI || '',
      STATUSKUNJUNGAN: pendaftaran.STATUSKUNJUNGAN,
    }));
    setPendaftaranOptions(options);
  } catch (err) {
    console.error('Gagal ambil data pendaftaran:', err);
  }
};


  const handleSearch = (keyword) => {
    if (!keyword) return setData(originalData);
    const filtered = originalData.filter(
      (item) =>
        item.NIK.toLowerCase().includes(keyword.toLowerCase()) ||
        item.NAMALENGKAP.toLowerCase().includes(keyword.toLowerCase())
    );
    setData(filtered);
  };

  const handleDateFilter = () => {
    if (!startDate && !endDate) return setData(originalData);
    const filtered = originalData.filter((item) => {
      const visitDate = new Date(item.TANGGALKUNJUNGAN);
      const from = startDate ? new Date(startDate.setHours(0, 0, 0, 0)) : null;
      const to = endDate ? new Date(endDate.setHours(23, 59, 59, 999)) : null;
      return (!from || visitDate >= from) && (!to || visitDate <= to);
    });
    setData(filtered);
  };

  const resetFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setData(originalData);
  };

  const handleSubmit = async () => {
    const isEdit = !!form.IDPENGOBATAN;
    const url = isEdit
      ? `${API_URL}/riwayatpengobatan/${form.IDPENGOBATAN}`
      : `${API_URL}/riwayatpengobatan`;

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
          await axios.delete(`${API_URL}/riwayatpengobatan/${row.IDPENGOBATAN}`);
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
    const today = new Date().toISOString().split('T')[0];
    setForm({
    IDPENGOBATAN: 0,
    IDPENDAFTARAN: '',
    NIK: '',
    NAMALENGKAP: '',
    TANGGALKUNJUNGAN: '',
    KELUHAN: '',
    POLI: '',
    STATUSKUNJUNGAN: 'Diperiksa',
    STATUSRAWAT: 'Rawat Jalan',
    DIAGNOSA: '',
    OBAT: '',
    });
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Riwayat Pengobatan Pasien</h3>

      <div className="flex flex-col md:flex-row justify-content-between md:items-center gap-4">
        <FilterTanggal
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          handleDateFilter={handleDateFilter}
          resetFilter={resetFilter}
        />
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

      <TabelPengobatan
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pendaftaranOptions={pendaftaranOptions}
      />

      <FormDialogPengobatan
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
        }}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        pendaftaranOptions={pendaftaranOptions}
      />
    </div>
  );
}

export default Page;