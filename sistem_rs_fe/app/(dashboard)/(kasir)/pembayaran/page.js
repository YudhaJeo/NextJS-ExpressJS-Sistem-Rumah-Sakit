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
import TabelPembayaran from './components/tabelPembayaran';
import FormDialogPembayaran from './components/formDialogPembayaran';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [invoiceOptions, setInvoiceOptions] = useState([]);
  const [pasienOptions, setPasienOptions] = useState([]);
  const [metodeOptions, setMetodeOptions] = useState([]);

  const [form, setForm] = useState({
    IDPEMBAYARAN: 0,
    NOPEMBAYARAN: '',
    IDINVOICE: '',
    NOINVOICE: '',
    NIK: '',
    NAMAPASIEN: '',
    ASURANSI: '',
    METODEPEMBAYARAN: '',
    JUMLAHBAYAR: 0,
    TANGGALBAYAR: '',
    KETERANGAN: '',
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
    fetchInvoices();
    fetchPasien();
    fetchMetode(); 
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/pembayaran`);
      setData(res.data.data);
      setOriginalData(res.data.data);
    } catch (err) {
      console.error('Gagal ambil data pembayaran:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      const res = await axios.get(`${API_URL}/invoice`);
      const options = res.data.data.map((inv) => ({
        label: `${inv.NOINVOICE} - ${inv.NAMAPASIEN}`,
        value: inv.IDINVOICE,
        NIK: inv.NIK,
        NAMAPASIEN: inv.NAMAPASIEN,
        NAMAASURANSI: inv.NAMAASURANSI,
        JUMLAHBAYAR: inv.TOTALTAGIHAN,
      }));
      setInvoiceOptions(options);
    } catch (err) {
      console.error('Gagal ambil data invoice:', err);
    }
  };

  const fetchPasien = async () => {
    try {
      const res = await axios.get(`${API_URL}/pasien`);
      const options = res.data.data.map((pasien) => ({
        label: `${pasien.NIK} - ${pasien.NAMALENGKAP}`,
        value: pasien.NIK,
        IDASURANSI: pasien.IDASURANSI,
        NAMAASURANSI: pasien.NAMAASURANSI,
      }));
      setPasienOptions(options);
    } catch (err) {
      console.error('Gagal ambil data pasien:', err);
    }
  };

  const fetchMetode = async () => {
    try {
      const res = await axios.get(`${API_URL}/metode_pembayaran/aktif`);
      const options = res.data.data.map((metode) => ({
        label: metode.NAMA,
        value: metode.NAMA,
      }));
      setMetodeOptions(options);
    } catch (err) {
      console.error('Gagal ambil metode pembayaran:', err);
    }
  };

  const handleSearch = (keyword) => {
    if (!keyword) return setData(originalData);
    const filtered = originalData.filter(
      (item) =>
        item.NOPEMBAYARAN.toLowerCase().includes(keyword.toLowerCase()) ||
        item.NAMAPASIEN.toLowerCase().includes(keyword.toLowerCase())
    );
    setData(filtered);
  };

  const handleDateFilter = () => {
    if (!startDate && !endDate) return setData(originalData);
    const filtered = originalData.filter((item) => {
      const tgl = new Date(item.TANGGALBAYAR);
      const from = startDate ? new Date(startDate.setHours(0, 0, 0, 0)) : null;
      const to = endDate ? new Date(endDate.setHours(23, 59, 59, 999)) : null;
      return (!from || tgl >= from) && (!to || tgl <= to);
    });
    setData(filtered);
  };

  const resetFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setData(originalData);
  };

  const handleSubmit = async () => {
    const isEdit = !!form.IDPEMBAYARAN;
    const url = isEdit
      ? `${API_URL}/pembayaran/${form.IDPEMBAYARAN}`
      : `${API_URL}/pembayaran`;

    try {
      if (isEdit) {
        const { NAMAPASIEN, NOINVOICE, ASURANSI, NOPEMBAYARAN, ...body } = form;
        await axios.put(url, body);
        toastRef.current?.showToast('00', 'Data berhasil diperbarui');
      } else {
        const { NOPEMBAYARAN, NAMAPASIEN, NOINVOICE, ASURANSI, ...body } = form;
        const res = await axios.post(url, body);
        const { NOPEMBAYARAN: generatedNo } = res.data;
        toastRef.current?.showToast('00', 'Data berhasil ditambahkan');
        setForm((prev) => ({ ...prev, NOPEMBAYARAN: generatedNo }));
      }

      fetchData();
      setDialogVisible(false);
      resetForm();
    } catch (err) {
      console.error('Gagal simpan data pembayaran:', err);
      toastRef.current?.showToast('01', 'Gagal menyimpan data');
    }
  };

  const handleEdit = (row) => {
    setForm({
      ...row,
      TANGGALBAYAR: row.TANGGALBAYAR?.split('T')[0] || '',
    });
    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    confirmDialog({
      message: `Hapus Pembayaran ${row.NOPEMBAYARAN}?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/pembayaran/${row.IDPEMBAYARAN}`);
          fetchData();
          toastRef.current?.showToast('00', 'Data berhasil dihapus');
        } catch (err) {
          console.error('Gagal hapus data pembayaran:', err);
          toastRef.current?.showToast('01', 'Gagal menghapus data');
        }
      },
    });
  };

  const resetForm = () => {
    setForm({
      IDPEMBAYARAN: 0,
      NOPEMBAYARAN: '',
      IDINVOICE: '',
      NOINVOICE: '',
      NIK: '',
      NAMAPASIEN: '',
      ASURANSI: '',
      METODEPEMBAYARAN: '',
      JUMLAHBAYAR: 0,
      TANGGALBAYAR: '',
      KETERANGAN: '',
    });
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />

      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Manajemen Pembayaran</h3>

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
          placeholder="Cari no pembayaran atau nama pasien..."
          onSearch={handleSearch}
          onAddClick={() => {
            resetForm();
            setDialogVisible(true);
          }}
        />
      </div>

      <TabelPembayaran
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialogPembayaran
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
        }}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        invoiceOptions={invoiceOptions}
        pasienOptions={pasienOptions}
        metodeOptions={metodeOptions} 
      />
    </div>
  );
};

export default Page;