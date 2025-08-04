'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import HeaderBar from '@/app/components/headerbar';
import TabelTindakanInap from './components/tabelTindakanInap';
import FormTindakanInap from './components/formTindakanInap';
import ToastNotifier from '@/app/components/toastNotifier';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const toastRef = useRef(null);
  const router = useRouter();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [pasienOptions, setPasienOptions] = useState([]);
  const [tindakanOptions, setTindakanOptions] = useState([]);

  const defaultForm = {
    IDTINDAKANINAP: '',
    IDRAWATINAP: '',
    IDTINDAKAN: '',
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
    fetchTindakan();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/tindakan_inap`);
      setData(res.data.data);
      setOriginalData(res.data.data);
    } catch (err) {
      console.error('Gagal ambil data tindakan pasien rawat inap:', err);
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

  const fetchTindakan = async () => {
    try {
      const res = await axios.get(`${API_URL}/tindakan_medis`);
      const options = res.data.data.map((item) => ({
        label: item.NAMATINDAKAN,
        value: item.IDTINDAKAN,
        HARGA: item.HARGA,
      }));
      setTindakanOptions(options);
    } catch (err) {
      console.error('Gagal ambil data tindakan:', err);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.IDRAWATINAP) newErrors.IDRAWATINAP = 'Pasien harus dipilih';
    if (!form.IDTINDAKAN) newErrors.IDTINDAKAN = 'Tindakan harus dipilih';
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

    const isEdit = !!form.IDTINDAKANINAP;
    const url = isEdit
      ? `${API_URL}/tindakan_inap/${form.IDTINDAKANINAP}`
      : `${API_URL}/tindakan_inap`;

    const selectedTindakan = tindakanOptions.find((o) => o.value === form.IDTINDAKAN);
    const harga = selectedTindakan?.HARGA || form.HARGA || 0;
    const jumlah = form.JUMLAH || 0;
    const total = harga * jumlah;

    const payload = {
      IDRAWATINAP: form.IDRAWATINAP,
      IDTINDAKAN: form.IDTINDAKAN,
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
    const selectedTindakan = tindakanOptions.find((o) => o.value === row.IDTINDAKAN);
    const harga = selectedTindakan?.HARGA || 0;

    setForm({
      IDTINDAKANINAP: row.IDTINDAKANINAP,
      IDRAWATINAP: row.IDRAWATINAP,
      IDTINDAKAN: row.IDTINDAKAN,
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
          await axios.delete(`${API_URL}/tindakan_inap/${row.IDTINDAKANINAP}`);
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
      <h3 className="text-xl font-semibold mb-3">Manajemen Tindakan Inap</h3>

      <HeaderBar
        title=""
        placeholder="Cari pasien"
        onSearch={(keyword) => {
          if (!keyword) return fetchData();
          const filtered = data.filter((item) =>
            item.NAMALENGKAP?.toLowerCase().includes(keyword.toLowerCase()) ||
            item.NAMATINDAKAN?.toLowerCase().includes(keyword.toLowerCase())
          );
          setData(filtered);
        }}
        onAddClick={() => {
          setForm(defaultForm);
          setDialogVisible(true);
        }}
      />

      <TabelTindakanInap
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormTindakanInap
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
        tindakanOptions={tindakanOptions}
      />
    </div>
  );
};

export default Page;
