'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import TabelKartu from './components/tabelKartu';
import FormDialogKartu from './components/formDialogKartu';
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
  const [obatOptions, setObatOptions] = useState([]);
  const [alkesOptions, setAlkesOptions] = useState([]);

  const [form, setForm] = useState({
    IDKARTU: '',
    IDOBAT: '',
    IDALKES: '',
    TANGGAL: '',
    JENISTRANSAKSI: '',
    JUMLAHOBAT: '',
    JUMLAHALKES: '',
    SISASTOK: '',
    KETERANGAN: '',
  });

  const toastRef = useRef(null);

  useEffect(() => {
    fetchData();
    fetchObat();
    fetchAlkes();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/kartu_stok`);
      setData(res.data);
      setOriginalData(res.data);
    } catch (err) {
      console.error('Gagal ambil data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchObat = async () => {
    try {
      const res = await axios.get(`${API_URL}/obat`);

      const options = res.data.data.map((obat) => ({
        label: `${obat.NAMAOBAT}`,
        value: obat.IDOBAT,
        STOKOBAT: obat.STOK
      }));

      setObatOptions(options);
    } catch (err) {
      console.error('Gagal ambil data obat:', err);
    }
  };

  const fetchAlkes = async () => {
    try {
      const res = await axios.get(`${API_URL}/alkes`);

      const options = res.data.data.map((alkes) => ({
        label: `${alkes.NAMAALKES}`,
        value: alkes.IDALKES,
        STOKALKES: alkes.STOK
      }));

      setAlkesOptions(options);
    } catch (err) {
      console.error('Gagal ambil data obat:', err);
    }
  };

  const handleSearch = (keyword) => {
    if (!keyword) return setData(originalData);
    const filtered = originalData.filter(
      (item) =>
        item.NAMAOBAT.toLowerCase().includes(keyword.toLowerCase())
    );
    setData(filtered);
  };

  const handleDateFilter = () => {
    if (!startDate && !endDate) return setData(originalData);
    const filtered = originalData.filter((item) => {
      const visitDate = new Date(item.TANGGAL);
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
  const isEdit = !!form.IDKARTU;
  const url = isEdit
    ? `${API_URL}/kartu_stok/${form.IDKARTU}`
    : `${API_URL}/kartu_stok`;

  try {
    // ✅ Validasi minimal salah satu ID (obat atau alkes harus dipilih)
    if (!form.IDOBAT && !form.IDALKES) {
      toastRef.current?.showToast('01', 'Pilih obat atau alkes terlebih dahulu');
      return;
    }

    // ✅ Pastikan nilai jumlah tidak undefined
    const payload = {
      ...form,
      JUMLAHOBAT: form.JUMLAHOBAT ? Number(form.JUMLAHOBAT) : 0,
      JUMLAHALKES: form.JUMLAHALKES ? Number(form.JUMLAHALKES) : 0,
    };

    if (isEdit) {
      await axios.put(url, payload);
      toastRef.current?.showToast('00', 'Data berhasil diperbarui');
    } else {
      await axios.post(url, payload);
      toastRef.current?.showToast('00', 'Data berhasil ditambahkan');
    }

    // ✅ Refresh data & reset form setelah backend selesai update stok
    await fetchData();
    resetForm();
    setDialogVisible(false);

  } catch (err) {
    console.error('Gagal simpan data:', err);

    // ✅ Ambil pesan error dari backend jika ada
    const errorMessage = err.response?.data?.error || 'Gagal menyimpan data';
    toastRef.current?.showToast('01', errorMessage);
  }
};


  const handleEdit = (row) => {
    setForm({
      ...row,
      TANGGAL: row.TANGGAL?.split('T')[0] || '',
    });
    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    confirmDialog({
      message: `Apakah Anda yakin ingin menghapus data milik ${row.NAMAOBAT}?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/kartu_stok/${row.IDKARTU}`);
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
    IDKARTU: 0,
    IDOBAT: '',
    IDALKES: '',
    TANGGAL: '',
    JENISTRANSAKSI: '',
    JUMLAHOBAT: '',
    JUMLAHALKES: '',
    SISASTOK: '',
    KETERANGAN: '',
    });
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Kartu Stok Apotek</h3>

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

      <TabelKartu
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialogKartu
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
        }}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        obatOptions={obatOptions}
        alkesOptions={alkesOptions}
      />
    </div>
  );
}

export default Page;