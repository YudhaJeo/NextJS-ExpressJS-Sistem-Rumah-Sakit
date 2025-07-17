// app\(dashboard)\(rawat_inap)\rawat_inap\menu\obat_inap\page.js
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
  const [bedOptions, setBedOptions] = useState([]);

  const defaultForm = {
    IDOBATINAP: '',
    IDRAWATINAP: '',
    IDOBAT: '',
    JUMLAH: '',
    STATUS: 'AKTIF',
    CATATAN: ''
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
    fetchBed();
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
      const res = await axios.get(`${API_URL}/pasien`);
      const options = res.data.data.map((pasien) => ({
        label: `${pasien.NAMALENGKAP} - ${pasien.NIK}`,
        value: pasien.IDRAWATINAP,
        NAMALENGKAP: pasien.NAMALENGKAP,
      }));
      setPasienOptions(options);
    } catch (err) {
      console.error('Gagal ambil data pasien:', err);
    }
  };

  const fetchBed = async () => {
    try {
      const res = await axios.get(`${API_URL}/bed`);
      const options = res.data.data.map((item) => ({
        label: `${item.NOMOROBAT} - ${item.NAMAKAMAR} - ${item.NAMABANGSAL}`,
        value: item.IDOBAT,
        NAMAKAMAR: item.NAMAKAMAR, 
        NAMABANGSAL: item.NAMABANGSAL,
      }));
      setBedOptions(options);
    } catch (err) {
      console.error('Gagal ambil bed:', err);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.IDRAWATINAP) newErrors.IDRAWATINAP = 'Pasien harus dipilih';
    if (!form.IDOBAT) newErrors.IDOBAT = 'Bed harus dipilih';
    if (!form.JUMLAH) newErrors.JUMLAH = 'Tanggal masuk wajib';

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

      
      try {
        let response;
        if (isEdit) {
          response = await axios.put(url, form);
        } else {
          response = await axios.post(url, form);
        }
      
        // validasi apakah response sukses
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
    setForm({
      IDOBATINAP: row.IDOBATINAP,
      IDRAWATINAP: row.IDRAWATINAP,
      IDOBAT: row.IDOBAT,
      JUMLAH: row.JUMLAH,
      CATATAN: row.CATATAN || ''
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
        bedOptions={bedOptions}
      />
    </div>
  );
};

export default Page;
