// app\(dashboard)\(rawat_inap)\rawat_inap\menu\rawat_inap\page.js
'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import HeaderBar from '@/app/components/headerbar';
import TabelRawatInap from './components/tabelRawatInap';
import FormRawatInap from './components/formRawatInap';
import ToastNotifier from '@/app/components/toastNotifier';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import FilterTanggal from '@/app/components/filterTanggal';

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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const defaultForm = {
    IDRAWATINAP: '',
    IDPASIEN: '',
    IDBED: '',
    TANGGALMASUK: '',
    TANGGALKELUAR: '',
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
      const res = await axios.get(`${API_URL}/rawat_inap`);
      setData(res.data.data); 
      setOriginalData(res.data.data);
    } catch (err) {
      console.error('Gagal ambil data rawat inap:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPasien = async () => {
    try {
      const res = await axios.get(`${API_URL}/pasien`);
      const options = res.data.data.map((pasien) => ({
        label: `${pasien.NAMALENGKAP} - ${pasien.NIK}`,
        value: pasien.IDPASIEN,
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
        label: `${item.NOMORBED} - ${item.NAMAKAMAR} - ${item.NAMABANGSAL}`,
        value: item.IDBED,
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
    if (!form.IDPASIEN) newErrors.IDPASIEN = 'Pasien harus dipilih';
    if (!form.IDBED) newErrors.IDBED = 'Bed harus dipilih';
    if (!form.TANGGALMASUK) newErrors.TANGGALMASUK = 'Tanggal masuk wajib';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setForm(defaultForm)
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    const isEdit = !!form.IDRAWATINAP;
    const url = isEdit
      ? `${API_URL}/rawat_inap/${form.IDRAWATINAP}`
      : `${API_URL}/rawat_inap`;
  
      const payload = {
        ...form,
        STATUS: form.TANGGALKELUAR ? 'SELESAI' : 'AKTIF',
        TANGGALMASUK: form.TANGGALMASUK
          ? new Date(form.TANGGALMASUK).toISOString().slice(0, 19).replace("T", " ")
          : null,
          TANGGALKELUAR:
          form.TANGGALKELUAR && form.TANGGALKELUAR !== ''
            ? new Date(form.TANGGALKELUAR).toISOString().slice(0, 19).replace("T", " ")
            : null,        
        CATATAN: form.CATATAN?.trim() || null,
      };
      
      try {
        let response;
        if (isEdit) {
          response = await axios.put(url, payload);
        } else {
          response = await axios.post(url, payload);
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
      IDRAWATINAP: row.IDRAWATINAP,
      IDPASIEN: row.IDPASIEN,
      IDBED: row.IDBED,
      TANGGALMASUK: row.TANGGALMASUK,
      TANGGALKELUAR: row.TANGGALKELUAR || '',
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
          await axios.delete(`${API_URL}/rawat_inap/${row.IDRAWATINAP}`);
          fetchData();
          toastRef.current?.showToast('00', 'Data berhasil dihapus');
        } catch (err) {
          console.error('Gagal hapus data:', err);
          toastRef.current?.showToast('01', 'Gagal menghapus data');
        }
      },
    });
  };

  
  const handleDateFilter = () => {
    if (!startDate && !endDate) return setData(originalData);

    const filtered = originalData.filter((item) => {
      const visitDate = new Date(item.TANGGALMASUK);
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

  const handleSearch = (keyword) => {
    if (!keyword) return fetchData();
    const filtered = data.filter((item) =>
      item.NAMALENGKAP?.toLowerCase().includes(keyword.toLowerCase()) ||
      item.NOMORBED?.toLowerCase().includes(keyword.toLowerCase()) ||
      item.STATUS?.toLowerCase().includes(keyword.toLowerCase()) 
    );
    setData(filtered);
  }

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />
      <h3 className="text-xl font-semibold mb-3">Manajemen Rawat Inap</h3>

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
          placeholder="Cari pasien"
          onSearch={handleSearch}
          onAddClick={() => {
            setForm(defaultForm);
            setDialogVisible(true);
          }}
        />
      </div>

      <TabelRawatInap
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormRawatInap
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