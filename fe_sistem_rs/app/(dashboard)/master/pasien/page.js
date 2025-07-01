// app/(dashboard)/master/pasien/page.js

'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import HeaderBar from '@/app/components/headerbar';
import TabelPasien from './components/tabelPasien';
import FormDialogPasien from './components/formDialogPasien';
import ToastNotifier from '@/app/components/toastNotifier';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  // DROP OPTION
  const [agamaOptions, setAgamaOptions] = useState([]);
  const [asuransiOptions, setAsuransiOptions] = useState([]);

  const fetchAgama = async () => {
    try {
      const res = await axios.get(`${API_URL}/agama`);
      const options = res.data.data.map((item) => ({
        label: item.NAMAAGAMA,
        value: item.IDAGAMA,
      }));
      setAgamaOptions(options);
    } catch (err) {
      console.error('Gagal ambil data pasien:', err);
    }
  };

  const fetchAsuransi = async () => {
    try {
      const res = await axios.get(`${API_URL}/asuransi`);
      const options = res.data.data.map((item) => ({
        label: item.NAMAASURANSI,
        value: item.IDASURANSI,
      }));
      setAsuransiOptions(options);
    } catch (err) {
      console.error('Gagal ambil data asuransi:', err);
    }
  };  

  const [form, setForm] = useState({
    NIK: '',
    NAMALENGKAP: '',
    TANGGALLAHIR: '',
    JENISKELAMIN: 'L',
    IDASURANSI: '',
    ALAMAT: '',
    NOHP: '',
    IDAGAMA: '',
    GOLDARAH: '',
    NOASURANSI: '',
  });

  const [errors, setErrors] = useState({});

  const toastRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchData();

    // LISTEN DROP OPTION
    fetchAgama();
    fetchAsuransi();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/pasien`);
      setData(res.data.data);
      setOriginalData(res.data.data);
    } catch (err) {
      console.error('Gagal ambil data:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.NAMALENGKAP.trim()) newErrors.NAMALENGKAP = <span style={{color: 'red'}}>Nama wajib diisi</span>;
    if (!form.NIK.trim()) {
      newErrors.NIK = <span style={{color: 'red'}}>NIK wajib diisi</span>;
    } else if (!/^\d{16}$/.test(form.NIK)) {
      newErrors.NIK = <span style={{color: 'red'}}>NIK harus 16 digit angka</span>;
    }

    if (!form.TANGGALLAHIR) newErrors.TANGGALLAHIR = <span style={{color: 'red'}}>Tanggal Lahir wajib diisi</span>;
    if (!form.JENISKELAMIN) newErrors.JENISKELAMIN = <span style={{color: 'red'}}>Jenis kelamin wajib dipilih</span>;
    if (!form.ALAMAT?.trim()) newErrors.ALAMAT = <span style={{color: 'red'}}>Alamat wajib diisi</span>;
    if (!form.NOHP?.trim()) {
      newErrors.NOHP = <span style={{ color: 'red' }}>No HP wajib diisi</span>;
    } else if (!/^\d{9,13}$/.test(form.NOHP)) {
      newErrors.NOHP = <span style={{ color: 'red' }}>No HP harus 9-13 digit angka</span>;    
    }

    if (!form.IDAGAMA) newErrors.IDAGAMA = <span style={{color: 'red'}}>Agama wajib diisi</span>;
    if (!form.GOLDARAH) newErrors.GOLDARAH = <span style={{color: 'red'}}>Golongan darah wajib dipilih</span>;
    if (!form.IDASURANSI) newErrors.IDASURANSI = <span style={{color: 'red'}}>Asuransi wajib dipilih</span>;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
  
    if (!validateForm()) return;

    const isEdit = !!form.IDPASIEN;
    const url = isEdit
      ? `${API_URL}/pasien/${form.IDPASIEN}`
      : `${API_URL}/pasien`;

    try {
      const payload = {
        ...form,
        TANGGALLAHIR: form.TANGGALLAHIR,
      };

      if (isEdit) {
        await axios.put(url, payload);
        toastRef.current?.showToast('00', 'Data pasien berhasil diperbarui');
      } else {
        await axios.post(url, payload);
        toastRef.current?.showToast('00', 'Pasien baru berhasil didaftarkan');
      }

      fetchData();
      setDialogVisible(false);
      resetForm();
    } catch (err) {
      console.error('Gagal simpan data:', err);
      toastRef.current?.showToast('01', 'Gagal menyimpan data pasien');
    }
  };

  const handleEdit = (row) => {
    const formattedTanggal = row.TANGGALLAHIR
      ? new Date(row.TANGGALLAHIR).toISOString().split('T')[0]
      : '';

    setForm({
      ...row,
      TANGGALLAHIR: formattedTanggal,
    });

    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    confirmDialog({
      message: `Apakah Anda yakin ingin menghapus pasien '${row.NAMALENGKAP}'?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/pasien/${row.IDPASIEN}`);
          fetchData();
          toastRef.current?.showToast('00', 'Data pasien berhasil dihapus');
        } catch (err) {
          console.error('Gagal hapus data:', err);
          toastRef.current?.showToast('01', 'Gagal menghapus data pasien');
        }
      },
    });
  };

  const resetForm = () => {
    setForm({
      NIK: '',
      NAMALENGKAP: '',
      TANGGALLAHIR: '',
      JENISKELAMIN: 'L',
      IDASURANSI: '',
      ALAMAT: '',
      NOHP: '',
      IDAGAMA: '',
      GOLDARAH: '',
      NOASURANSI: '',
    });
    setErrors({});
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Master Data Pasien</h3>

      <HeaderBar
        title=""
        placeholder="Cari berdasarkan NIK atau Nama"
        onSearch={handleSearch}
        onAddClick={() => {
          resetForm();
          setDialogVisible(true);
        }}
      />

      <TabelPasien 
        data={data} 
        loading={loading} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      <FormDialogPasien
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
        }}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        errors={errors}
        // DROP DOWN OPTION
        agamaOptions={agamaOptions}
        asuransiOptions={asuransiOptions}
      />
    </div>
  );
};

export default Page;