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
import TabelDeposit from './components/tabelDeposit';
import FormDialogDeposit from './components/formDialogDeposit';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [metodeOptions, setMetodeOptions] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);
  const [invoiceOptions, setInvoiceOptions] = useState([]);

  const [form, setForm] = useState({
    IDDEPOSIT: 0,
    NODEPOSIT: '',
    NIK: '',
    NAMAPASIEN: '',
    TANGGALDEPOSIT: '',
    METODE: '',
    IDBANK: '',
    NOMINAL: 0,
    SALDO_SISA: 0,
    STATUS: 'AKTIF',
    KETERANGAN: '',
  });

  const toastRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    fetchData();
    fetchInvoices();
    fetchMetodePembayaran();
    fetchBanks();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/deposit`);
      setData(res.data.data);
      setOriginalData(res.data.data);
    } catch (err) {
      console.error('Gagal ambil data deposit:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      const res = await axios.get(`${API_URL}/invoice`);
      const options = res.data.data.map((inv) => ({
        label: `${inv.NOINVOICE} - ${inv.NIK} - ${inv.NAMALENGKAP}`,
        value: inv.IDINVOICE,
        NIK: inv.NIK,
        NOINVOICE: inv.NOINVOICE,
        NAMAPASIEN: inv.NAMALENGKAP,
      }));
      setInvoiceOptions(options);
    } catch (err) {
      console.error('Gagal ambil data invoice:', err);
    }
  };

  const fetchMetodePembayaran = async () => {
    try {
      const res = await axios.get(`${API_URL}/metode_pembayaran/aktif`);
      const aktif = res.data.data
        .filter((m) => m.STATUS === 'AKTIF')
        .map((m) => ({
          label: m.NAMA,
          value: m.NAMA
        }));
      setMetodeOptions(aktif);
    } catch (err) {
      console.error('Gagal fetch metode pembayaran:', err);
    }
  };

  const fetchBanks = async () => {
    const res = await axios.get(`${API_URL}/bank_account`);
    const options = res.data.data
      .filter((b) => b.STATUS === 'AKTIF')
      .map((b) => ({
        label: `${b.NAMA_BANK} - ${b.NO_REKENING} a.n ${b.ATAS_NAMA}`,
        value: b.IDBANK,
      }));
    setBankOptions(options);
  };

  const handleSearch = (keyword) => {
    if (!keyword) return setData(originalData);
    const filtered = originalData.filter(
      (item) =>
        item.NODEPOSIT.toLowerCase().includes(keyword.toLowerCase()) ||
        item.NAMAPASIEN.toLowerCase().includes(keyword.toLowerCase())
    );
    setData(filtered);
  };

  const handleDateFilter = () => {
    if (!startDate && !endDate) return setData(originalData);
    const filtered = originalData.filter((item) => {
      const depositDate = new Date(item.TANGGALDEPOSIT);
      const from = startDate ? new Date(startDate.setHours(0, 0, 0, 0)) : null;
      const to = endDate ? new Date(endDate.setHours(23, 59, 59, 999)) : null;
      return (!from || depositDate >= from) && (!to || depositDate <= to);
    });
    setData(filtered);
  };

  const resetFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setData(originalData);
  };

  const handleSubmit = async () => {
    const isEdit = !!form.IDDEPOSIT;
    const url = isEdit
      ? `${API_URL}/deposit/${form.IDDEPOSIT}`
      : `${API_URL}/deposit`;

    // Buat salinan form yang benar-benar fix statusnya:
    const body = { ...form };
    if (body.SALDO_SISA === 0) {
      body.STATUS = 'HABIS';
    }

    try {
      if (isEdit) {
        const { NODEPOSIT, NAMAPASIEN, ...payload } = body;
        await axios.put(url, payload);
        toastRef.current?.showToast('00', 'Data berhasil diperbarui');
      } else {
        await axios.post(url, body);
        toastRef.current?.showToast('00', 'Data berhasil ditambahkan');
      }

      fetchData();
      setDialogVisible(false);
      resetForm();
    } catch (err) {
      console.error('Gagal simpan data deposit:', err);
      toastRef.current?.showToast('01', 'Gagal menyimpan data');
    }
  };

  const handleEdit = (row) => {
    setForm({
      ...row,
      TANGGALDEPOSIT: row.TANGGALDEPOSIT?.split('T')[0] || '',
    });
    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    confirmDialog({
      message: `Hapus Deposit ${row.NODEPOSIT}?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/deposit/${row.IDDEPOSIT}`);
          fetchData();
          toastRef.current?.showToast('00', 'Data berhasil dihapus');
        } catch (err) {
          console.error('Gagal hapus data deposit:', err);
          toastRef.current?.showToast('01', 'Gagal menghapus data');
        }
      },
    });
  };

  const resetForm = () => {
    setForm({
      IDDEPOSIT: 0,
      NODEPOSIT: '',
      NIK: '',
      NAMAPASIEN: '',
      TANGGALDEPOSIT: '',
      METODE: '',
      IDBANK: '',
      NOMINAL: 0,
      SALDO_SISA: 0,
      STATUS: 'AKTIF',
      KETERANGAN: '',
    });
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Manajemen Deposit</h3>

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
          placeholder="Cari no deposit atau nama pasien..."
          onSearch={handleSearch}
          onAddClick={() => {
            resetForm();
            setDialogVisible(true);
          }}
        />
      </div>

      <TabelDeposit
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialogDeposit
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
        }}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        metodeOptions={metodeOptions}
        bankOptions={bankOptions}
        invoiceOptions={invoiceOptions}
      />
    </div>
  );
};

export default Page;