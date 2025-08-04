'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import HeaderBar from '@/app/components/headerbar';
import TabelObatInap from './components/tabelObatInap';
import FormObatInap from './components/formObatInap';
import ToastNotifier from '@/app/components/toastNotifier';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const toastRef = useRef(null);
  const router = useRouter();

  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [pasienOptions, setPasienOptions] = useState([]);
  const [obatOptions, setObatOptions] = useState([]);

  const defaultForm = {
    IDOBATINAP: '',
    IDRAWATINAP: '',
    IDOBAT: '',
    JUMLAH: '1',
  };

  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchData();
    fetchPasien();
    fetchObat();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/obat_inap`);
      setData(res.data.data);
      setOriginalData(res.data.data);
    } catch (err) {
      console.error('Gagal ambil data obat pasien rawat inap:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPasien = async () => {
    try {
      const res = await axios.get(`${API_URL}/rawat_inap`);
      const options = res.data.data
        .filter((item) => item.STATUS === 'AKTIF')
        .map((pasien) => ({
          label: pasien.NAMALENGKAP,
          value: pasien.IDRAWATINAP,
        }));
      setPasienOptions(options);
    } catch (err) {
      console.error('Gagal ambil data pasien:', err);
    }
  };

  const fetchObat = async () => {
    try {
      const res = await axios.get(`${API_URL}/obat`);
      const options = res.data.data.map((item) => ({
        label: item.NAMAOBAT,
        value: item.IDOBAT,
        HARGA: item.HARGA,
      }));
      setObatOptions(options);
    } catch (err) {
      console.error('Gagal ambil data obat:', err);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.IDRAWATINAP) newErrors.IDRAWATINAP = 'Pasien harus dipilih';
    if (!form.IDOBAT) newErrors.IDOBAT = 'Obat harus dipilih';
    if (
      form.JUMLAH === null ||
      form.JUMLAH === undefined ||
      isNaN(form.JUMLAH)
    ) {
      newErrors.JUMLAH = (
        <span style={{ color: 'red' }}>Jumlah wajib diisi</span>
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setForm(defaultForm)
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const isEdit = !!form.IDOBATINAP;
    const url = isEdit
      ? `${API_URL}/obat_inap/${form.IDOBATINAP}`
      : `${API_URL}/obat_inap`;

    const selectedObat = obatOptions.find((o) => o.value === form.IDOBAT);
    const harga = selectedObat?.HARGA || form.HARGA || 0;
    const jumlah = form.JUMLAH || 0;
    const total = harga * jumlah;

    const payload = {
      IDRAWATINAP: form.IDRAWATINAP,
      IDOBAT: form.IDOBAT,
      JUMLAH: jumlah,
      HARGA: harga,
      TOTAL: total,
    };

    try {
      const response = isEdit
        ? await axios.put(url, payload)
        : await axios.post(url, payload);

      if (response.status === 200 && response.data?.message) {
        toastRef.current?.showToast('00', response.data.message);
      } else {
        throw new Error('Respons tidak valid');
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
    const selectedObat = obatOptions.find((o) => o.value === row.IDOBAT);
    const harga = selectedObat?.HARGA || 0;

    setForm({
      IDOBATINAP: row.IDOBATINAP,
      IDRAWATINAP: row.IDRAWATINAP,
      IDOBAT: row.IDOBAT,
      JUMLAH: row.JUMLAH,
      HARGA: harga,
      TOTAL: harga * row.JUMLAH,
    });
    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    confirmDialog({
      message: `Yakin hapus data rawat inap ini?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/obat_inap/${row.IDOBATINAP}`);
          fetchData();
          toastRef.current?.showToast('00', 'Data berhasil dihapus');
        } catch (err) {
          console.error('Gagal hapus data:', err);
          toastRef.current?.showToast('01', 'Gagal menghapus data');
        }
      },
    });
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />
      <h3 className="text-xl font-semibold mb-3">Manajemen Obat Inap</h3>

      <HeaderBar
        title=""
        placeholder="Cari pasien"
        onSearch={(keyword) => {
          if (!keyword) return fetchData();
          const filtered = data.filter((item) =>
            item.NAMALENGKAP?.toLowerCase().includes(keyword.toLowerCase()) ||
            item.NOMOROBAT?.toLowerCase().includes(keyword.toLowerCase()) ||
            item.STATUS?.toLowerCase().includes(keyword.toLowerCase())
          );
          setData(filtered);
        }}
        onAddClick={() => {
          setForm(defaultForm);
          setDialogVisible(true);
        }}
      />

      <TabelObatInap
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormObatInap
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          setForm(defaultForm);
        }}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        errors={errors}
        pasienOptions={pasienOptions}
        obatOptions={obatOptions}
      />
    </div>
  );
};

export default Page;
