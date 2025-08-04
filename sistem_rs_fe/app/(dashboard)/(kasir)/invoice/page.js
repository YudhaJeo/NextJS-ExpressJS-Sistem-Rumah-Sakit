'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import HeaderBar from '@/app/components/headerbar';
import ToastNotifier from '@/app/components/toastNotifier';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';
import FilterTanggal from '@/app/components/filterTanggal';
import TabelInvoice from './components/tabelInvoice';
import FormDialogInvoice from './components/formDialogInvoice';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [pasienOptions, setPasienOptions] = useState([]);

  const [form, setForm] = useState({
    IDINVOICE: 0,
    NOINVOICE: '',
    NIK: '',
    NAMAPASIEN: '',
    TANGGALINVOICE: '',
    TOTALTAGIHAN: 0,
    TOTALDEPOSIT: 0,
    TOTALANGSURAN: 0,
    SISA_TAGIHAN: 0,
    STATUS: 'BELUM_LUNAS',
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
    fetchPasien();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/invoice`);
      setData(res.data.data);
      setOriginalData(res.data.data);
    } catch (err) {
      console.error('Gagal ambil data invoice:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPasien = async () => {
    try {
      const res = await axios.get(`${API_URL}/pasien`);
      const options = res.data.data.map((pasien) => ({
        label: `${pasien.NIK} - ${pasien.NAMALENGKAP}`,
        value: pasien.NIK,
        NAMALENGKAP: pasien.NAMALENGKAP,
        ASURANSI: pasien.NAMAASURANSI || '-',
      }));
      setPasienOptions(options);
    } catch (err) {
      console.error('Gagal ambil data pasien:', err);
    }
  };

  const handleSearch = (keyword) => {
    if (!keyword) return setData(originalData);
    const filtered = originalData.filter(
      (item) =>
        item.NOINVOICE.toLowerCase().includes(keyword.toLowerCase()) ||
        item.NAMAPASIEN.toLowerCase().includes(keyword.toLowerCase())
    );
    setData(filtered);
  };

  const handleDateFilter = () => {
    if (!startDate && !endDate) return setData(originalData);
    const filtered = originalData.filter((item) => {
      const invoiceDate = new Date(item.TANGGALINVOICE);
      const from = startDate ? new Date(startDate.setHours(0, 0, 0, 0)) : null;
      const to = endDate ? new Date(endDate.setHours(23, 59, 59, 999)) : null;
      return (!from || invoiceDate >= from) && (!to || invoiceDate <= to);
    });
    setData(filtered);
  };

  const resetFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setData(originalData);
  };

  const handleSubmit = async () => {
    if (!form.IDINVOICE) return;

    const url = `${API_URL}/invoice/${form.IDINVOICE}`;
    try {
      const { NOINVOICE, NAMAPASIEN, ASURANSI, ...body } = form;
      await axios.put(url, body);
      toastRef.current?.showToast('00', 'Data berhasil diperbarui');
      fetchData();
      setDialogVisible(false);
      resetForm();
    } catch (err) {
      console.error('Gagal simpan data invoice:', err);
      toastRef.current?.showToast('01', 'Gagal menyimpan data');
    }
  };

  const handleEdit = (row) => {
    setForm({
      ...row,
      TANGGALINVOICE: row.TANGGALINVOICE?.split('T')[0] || '',
      TOTALDEPOSIT: row.TOTALDEPOSIT || 0,
      TOTALANGSURAN: row.TOTALANGSURAN || 0,
      SISA_TAGIHAN: row.SISA_TAGIHAN || 0,
    });
    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    confirmDialog({
      message: `Hapus Invoice ${row.NOINVOICE}?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/invoice/${row.IDINVOICE}`);
          fetchData();
          toastRef.current?.showToast('00', 'Data berhasil dihapus');
        } catch (err) {
          console.error('Gagal hapus data invoice:', err);
          toastRef.current?.showToast('01', 'Gagal menghapus data');
        }
      },
    });
  };

  const resetForm = () => {
    setForm({
      IDINVOICE: 0,
      NOINVOICE: '',
      NIK: '',
      NAMAPASIEN: '',
      TANGGALINVOICE: '',
      TOTALTAGIHAN: 0,
      TOTALDEPOSIT: 0,
      TOTALANGSURAN: 0,
      SISA_TAGIHAN: 0,
      STATUS: 'BELUM_LUNAS',
    });
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />

      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Manajemen Invoice</h3>

      <div className="flex flex-col md:flex-row justify-content-between md:items-center gap-4">

        <FilterTanggal
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          handleDateFilter={handleDateFilter}
          resetFilter={resetFilter}
        />

      </div>

      <TabelInvoice
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialogInvoice
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