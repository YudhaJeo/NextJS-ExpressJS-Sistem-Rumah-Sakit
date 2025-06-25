"use client";

import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Reservasi } from './components/reservasi';
import TabelReservasiPasien from './components/tabelReservasi';
import FormReservasiPasien from './components/formReservasi';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { getCookie } from '@/utils/cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ReservasiPasienPage = () => {
  const [data, setData] = useState<Reservasi[]>([]);
  const [originalData, setOriginalData] = useState<Reservasi[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  const [formData, setFormData] = useState<Reservasi>({
    NIK: '',
    POLI: '',
    NAMADOKTER: '',
    TANGGALRESERVASI: '',
    JAMRESERVASI: '',
    STATUS: 'Menunggu',
    KETERANGAN: '',
  });

  const fetchReservasi = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/reservasi`);
      setData(res.data);
      setOriginalData(res.data);
    } catch (err) {
      console.error('Gagal mengambil data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (keyword: string) => {
    if (!keyword) {
      setData(originalData);
    } else {
      const filtered = originalData.filter(
        (item) =>
          item.NIK?.toLowerCase().includes(keyword) ||
          item.NAMADOKTER?.toLowerCase().includes(keyword) 
      );
      setData(filtered);
    }
  };

  const handleSubmit = async () => {
    const isEdit = !!formData.IDRESERVASI;
    const url = isEdit
      ? `${API_URL}/reservasi/${formData.IDRESERVASI}`
      : `${API_URL}/reservasi`;

    try {
      if (isEdit) {
        await axios.put(url, formData);
      } else {
        await axios.post(url, formData);
      }
      fetchReservasi();
      setDialogVisible(false);
      resetForm();
    } catch (err) {
      console.error('Gagal menyimpan data:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      NIK: '',
      POLI: '',
      NAMADOKTER: '',
      TANGGALRESERVASI: '',
      JAMRESERVASI: '',
      STATUS: 'Menunggu',
      KETERANGAN: '',
    });
  };

  const handleEdit = (row: Reservasi) => {
    setFormData(row);
    setDialogVisible(true);
  };

  const handleDelete = async (row: Reservasi) => {
    try {
      await axios.delete(`${API_URL}/reservasi/${row.IDRESERVASI}`);
      fetchReservasi();
    } catch (err) {
      console.error('Gagal menghapus data:', err);
    }
  };

  const router = useRouter();

  useEffect(() => {
    fetchReservasi();
    const token = Cookies.get('token');
        if(!token){
            router.push('/login');
        };
  }, []);

  return (
    <div className="card">
      <h3 className="text-xl font-semibold">Reservasi Pasien</h3>

      <div className="flex justify-content-end items-center my-3 gap-3">
        <span className="p-input-icon-left w-80">
          <i className="pi pi-search" />
          <InputText
            placeholder="Cari NIK atau Nama"
            className="w-full"
            onChange={(e) => handleSearch(e.target.value.toLowerCase())}
          />
        </span>

        <Button
          label="Tambah"
          icon="pi pi-plus"
          onClick={() => setDialogVisible(true)}
        />
      </div>

      <TabelReservasiPasien
        data={data}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormReservasiPasien
        visible={dialogVisible}
        formData={formData}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
        }}
        onChange={setFormData}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ReservasiPasienPage;
