'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import HeaderBar from '@/app/components/headerbar';
import ToastNotifier from '@/app/components/toastNotifier';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import FilterTanggal from '@/app/components/filterTanggal';
import TabelDepositPenggunaan from './components/tabelDepositPenggunaan';
import FormDialogDepositPenggunaan from './components/formDialogDepositPenggunaan';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [depositOptions, setDepositOptions] = useState([]);
  const [invoiceOptions, setInvoiceOptions] = useState([]);

  const [form, setForm] = useState({
    IDPENGGUNAAN: 0,
    IDDEPOSIT: null,
    IDINVOICE: null,
    TANGGALPEMAKAIAN: '',
    JUMLAH_PEMAKAIAN: 0,
    NIK: '',
    NAMAPASIEN: '',
  });

  const toastRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    fetchData();
    fetchDepositOptions();
    fetchInvoiceOptions();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/deposit_penggunaan`);
      setData(res.data.data);
      setOriginalData(res.data.data);
    } catch (err) {
      console.error('Gagal ambil data penggunaan deposit:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (keyword) => {
    if (!keyword) return setData(originalData);
    const filtered = originalData.filter(
      (item) =>
        item.NOPENGGUNAAN.toLowerCase().includes(keyword.toLowerCase()) ||
        item.NODEPOSIT.toLowerCase().includes(keyword.toLowerCase())
    );
    setData(filtered);
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  };

  const fetchDepositOptions = async () => {
    try {
      const res = await axios.get(`${API_URL}/deposit/options`);
      setDepositOptions(res.data.data.map(item => ({
        value: item.value,
        label: `${item.label} - ${item.NAMAPASIEN} | Sisa: ${formatRupiah(item.SALDO_SISA)}`,
        nik: item.NIK,
        NAMAPASIEN: item.NAMAPASIEN,
      })));
    } catch (err) {
      console.error('Gagal ambil daftar deposit:', err);
    }
  };

  const fetchInvoiceOptions = async () => {
    const res = await axios.get(`${API_URL}/invoice`);
    setInvoiceOptions(res.data.data.map(item => ({
      value: item.IDINVOICE,
      label: `${item.NOINVOICE} - ${item.NAMAPASIEN}`,
      nik: item.NIK,
      NAMAPASIEN: item.NAMAPASIEN,
    })));
  };

  const handleDateFilter = () => {
    if (!startDate && !endDate) return setData(originalData);
    const filtered = originalData.filter((item) => {
      const date = new Date(item.TANGGALPENGGUNAAN);
      const from = startDate ? new Date(startDate.setHours(0, 0, 0, 0)) : null;
      const to = endDate ? new Date(endDate.setHours(23, 59, 59, 999)) : null;
      return (!from || date >= from) && (!to || date <= to);
    });
    setData(filtered);
  };

  const resetFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setData(originalData);
  };

  const handleSubmit = async () => {
    const isEdit = !!form.IDPENGGUNAAN;
    const url = isEdit
      ? `${API_URL}/deposit_penggunaan/${form.IDPENGGUNAAN}`
      : `${API_URL}/deposit_penggunaan`;

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
      console.error('Gagal simpan data penggunaan deposit:', err);
      toastRef.current?.showToast('01', 'Gagal menyimpan data');
    }
  };

  const handleEdit = (row) => {
    setForm({
      IDPENGGUNAAN: row.IDPENGGUNAAN,
      IDDEPOSIT: row.IDDEPOSIT,
      IDINVOICE: row.IDINVOICE,
      TANGGALPEMAKAIAN: row.TANGGALPEMAKAIAN?.split('T')[0] || '',
      JUMLAH_PEMAKAIAN: row.JUMLAH_PEMAKAIAN,
      NIK: row.NIK,
      NAMAPASIEN: row.NAMAPASIEN,
    });
    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    confirmDialog({
      message: `Hapus Penggunaan ${row.NODEPOSIT}?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/deposit_penggunaan/${row.IDPENGGUNAAN}`);
          fetchData();
          toastRef.current?.showToast('00', 'Data berhasil dihapus');
        } catch (err) {
          console.error('Gagal hapus data penggunaan deposit:', err);
          toastRef.current?.showToast('01', 'Gagal menghapus data');
        }
      },
    });
  };

  const resetForm = () => {
    setForm({
      IDPENGGUNAAN: 0,
      IDDEPOSIT: null,
      IDINVOICE: null,
      TANGGALPEMAKAIAN: '',
      JUMLAH_PEMAKAIAN: 0,
      NIK: '',
      NAMAPASIEN: '',
    });
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Manajemen Deposit Penggunaan</h3>

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
          placeholder="Cari no penggunaan atau no deposit..."
          onSearch={handleSearch}
          onAddClick={() => {
            resetForm();
            setDialogVisible(true);
          }}
        />
      </div>

      <TabelDepositPenggunaan
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialogDepositPenggunaan
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
        }}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        depositOptions={depositOptions}
        invoiceOptions={invoiceOptions}
      />
    </div>
  );
};

export default Page;