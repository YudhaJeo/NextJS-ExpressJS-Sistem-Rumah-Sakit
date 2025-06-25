'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import TabelDokumen from './components/tabelDokumen';
import { Dokumen } from '@/types/dokumen';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import HeaderBar from "@/components/headerbar";
import FormDialogDokumen from "./components/formDialogDokumen";

const JenisDokumenOptions = [
  { label: 'Hasil Lab', value: 'Hasil Lab' },
  { label: 'Resume Medis', value: 'Resume Medis' },
  { label: 'Rekam Rawat Jalan', value: 'Rekam Rawat Jalan' },
];

const Page = () => {
  const [data, setData] = useState<Dokumen[]>([]);
  const [originalData, setOriginalData] = useState<Dokumen[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [form, setForm] = useState<Dokumen>({
    IDDOKUMEN: 0,
    NAMALENGKAP: '',
    NIK: '',
    JENISDOKUMEN: '',
    NAMAFILE: '',
    LOKASIFILE: '',
    TANGGALUPLOAD: new Date().toISOString(),
    file: undefined,
  });
  
  const [pasienOptions, setPasienOptions] = useState<
  { label: string; value: string; NAMALENGKAP: string }[]
  >([]);
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const fetchPasien = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/pasien');
      const options = res.data.data.map((pasien: any) => ({
        label: `${pasien.NIK} - ${pasien.NAMALENGKAP}`,
        value: pasien.NIK,
        NAMALENGKAP: pasien.NAMALENGKAP,
      }));
      setPasienOptions(options);
    } catch (err) {
      console.error('Gagal ambil data pasien:', err);
    }
  };
  
  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/dokumen');
      setData(res.data.data);
      setOriginalData(res.data.data); // Wajib agar pencarian berfungsi
    } catch (err) {
      console.error('Gagal mengambil data dokumen:', err);
    }
  };
  
  const router = useRouter();
  useEffect(() => {
    fetchData();
    fetchPasien();
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
    }
  }, []);
  
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.NIK.trim()) newErrors.NIK = 'NIK wajib diisi';
    else if (!/^\d{16}$/.test(form.NIK)) newErrors.NIK = 'NIK harus 16 digit angka';
    if (!form.JENISDOKUMEN) newErrors.JENISDOKUMEN = 'Jenis dokumen wajib dipilih';
    if (!form.file && !form.IDDOKUMEN) newErrors.file = 'File wajib diunggah';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append('NIK', form.NIK);
      formData.append('JENISDOKUMEN', form.JENISDOKUMEN || '');
      formData.append('NAMAFILE', form.NAMAFILE);

      if (form.file) {
        formData.append('file', form.file);
      }

      if (form.IDDOKUMEN) {
        await axios.put(`http://localhost:4000/api/dokumen/${form.IDDOKUMEN}`, formData);
      } else {
        await axios.post('http://localhost:4000/api/dokumen', formData);
      }

      fetchData();
      setDialogVisible(false);
      resetForm();
    } catch (err) {
      console.error('Gagal menyimpan data:', err);
    }
  };

  const handleSearch = (keyword: string) => {
    const query = keyword.toLowerCase();
    if (!query.trim()) {
      setData(originalData);
      return;
    }

    const filtered = originalData.filter((item) => {
      const nik = item.NIK?.toLowerCase() || '';
      const nama = item.NAMALENGKAP?.toLowerCase() || '';
      return nik.includes(query) || nama.includes(query);
    });

    setData(filtered);
  };

  const handleEdit = (row: Dokumen) => {
    setForm({
      IDDOKUMEN: row.IDDOKUMEN,
      NAMALENGKAP: row.NAMALENGKAP,
      NIK: row.NIK,
      JENISDOKUMEN: row.JENISDOKUMEN || '',
      NAMAFILE: row.NAMAFILE || '',
      LOKASIFILE: row.LOKASIFILE || '',
      TANGGALUPLOAD: row.TANGGALUPLOAD,
      file: undefined,
    });
    setDialogVisible(true);
  };

const handleDelete = async (row: Dokumen) => {
  try {
    await axios.delete(`http://localhost:4000/api/dokumen/${row.IDDOKUMEN}`);
    fetchData();
  } catch (err) {
    console.error('Gagal menghapus dokumen:', err);
  }
};

  const resetForm = () => {
    setForm({
      IDDOKUMEN: 0,
      NAMALENGKAP: '',
      NIK: '',
      JENISDOKUMEN: '',
      NAMAFILE: '',
      LOKASIFILE: '',
      TANGGALUPLOAD: new Date().toISOString(),
      file: undefined,
    });
    setErrors({});
  };

const inputClass = (field: string) =>
  errors[field] ? 'p-invalid w-full mt-2' : 'w-full mt-2';

return (
  <div className="card">
      <h3 className="text-xl font-semibold">Manajemen Dokumen Rekam Medis</h3>
      
      <HeaderBar
        title=""
        placeholder="Cari nama atau NIK..."
        onSearch={handleSearch}
        onAddClick={() => setDialogVisible(true)}
      />

      <TabelDokumen
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={false}
        onDownload={() => {}}
      />

      <FormDialogDokumen
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
        }}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        pasienOptions={pasienOptions}
        errors={errors}
        inputClass={inputClass}
        JenisDokumenOptions={JenisDokumenOptions}
      />
    </div>
  );
};

export default Page;
