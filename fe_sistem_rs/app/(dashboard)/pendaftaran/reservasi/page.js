"use client";

import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import TabelReservasiPasien from './components/tabelReservasi';
import FormReservasiPasien from './components/formReservasi';
import HeaderBar from '@/app/components/headerbar';
import ToastNotifier from '@/app/components/toastNotifier';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ReservasiPasienPage = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  const [formData, setFormData] = useState({
    IDRESERVASI: 0,
    NIK: '',
    IDPOLI: '',
    IDDOKTER: '',
    TANGGALRESERVASI: '',
    JAMRESERVASI: '',
    STATUS: 'Menunggu',
    KETERANGAN: '',
  });

  const [pasienOptions, setPasienOptions] = useState([]);
  const [poliOptions, setPoliOptions] = useState([]);
  const [dokterOptions, setDokterOptions] = useState([]);


  const toastRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchReservasi();
    fetchPasien();
    fetchPoli();
    fetchDokter();
  }, []);

  const fetchReservasi = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/reservasi`);
      console.log('Data reservasi API:', res.data);
      setData(res.data);
      setOriginalData(res.data);
    } catch (err) {
      console.error('Gagal mengambil data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPasien = async () => {
    try {
      const res = await axios.get(`${API_URL}/pasien`);
      const options = res.data.data.map((pasien) => ({
        label: `${pasien.NIK} - ${pasien.NAMALENGKAP}`,
        value: pasien.NIK,
        NAMALENGKAP: pasien.NAMALENGKAP,
      }));
      setPasienOptions(options);
    } catch (err) {
      console.error('Gagal ambil data pasien:', err);
    }
  };

const fetchPoli = async () => {
  try {
    const res = await axios.get(`${API_URL}/poli`);
    console.log('Data poli API:', res.data);

    // Jika response berupa array langsung
    const options = res.data.map((poli) => ({
      label: `${poli.IDPOLI} - ${poli.NAMAPOLI}`,
      value: poli.IDPOLI,
      }));

    setPoliOptions(options);
      } catch (err) {
    console.error('Gagal ambil data poli:', err);
      }
    };

const fetchDokter = async () => {
  try {
    const res = await axios.get(`${API_URL}/dokter`);
    console.log('Data poli API:', res.data);

    // Jika response berupa array langsung
    const options = res.data.map((nama_dokter) => ({
      label: `${nama_dokter.IDDOKTER} - ${nama_dokter.NAMADOKTER}`,
      value: nama_dokter.IDDOKTER,
    }));

    setDokterOptions(options);
  } catch (err) {
    console.error('Gagal ambil data poli:', err);
  }
};


  const handleSearch = (keyword) => {
    if (!keyword) {
      setData(originalData);
    } else {
      const filtered = originalData.filter(
        (item) =>
          item.NIK.toLowerCase().includes(keyword.toLowerCase()) ||
          item.NAMADOKTER.toLowerCase().includes(keyword.toLowerCase())
      );
      setData(filtered);
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.NIK ||
      !formData.IDPOLI ||
      !formData.IDDOKTER ||
      !formData.TANGGALRESERVASI ||
      !formData.JAMRESERVASI ||
      !formData.STATUS
    ) {
      toastRef.current?.showToast('01', 'Semua field wajib diisi!');
      return;
    }

    const isEdit = !!formData.IDRESERVASI;
    const url = isEdit
      ? `${API_URL}/reservasi/${formData.IDRESERVASI}`
      : `${API_URL}/reservasi`;

    try {
      if (isEdit) {
        await axios.put(url, formData);
        toastRef.current?.showToast('00', 'Data berhasil diperbarui');
      } else {
        await axios.post(url, formData);
        toastRef.current?.showToast('00', 'Data berhasil ditambahkan');
      }
      fetchReservasi();
      setDialogVisible(false);
      resetForm();
    } catch (err) {
      console.error('Gagal menyimpan data:', err);
      toastRef.current?.showToast('01', 'Gagal menyimpan data');
    }
  };

  const handleEdit = (row) => {
    setFormData({
      ...row,
      TANGGALRESERVASI: row.TANGGALRESERVASI?.split('T')[0] || '',
    });
    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    confirmDialog({
      message: `Apakah Anda yakin ingin menghapus data milik ${row.IDRESERVASI}?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/reservasi/${row.IDRESERVASI}`);
          fetchReservasi();
          toastRef.current?.showToast('00', 'Data berhasil dihapus');
        } catch (err) {
          console.error('Gagal menghapus data:', err);
          toastRef.current?.showToast('01', 'Gagal menghapus data');
        }
      },
    });
  };

  const resetForm = () => {
    setFormData({
      IDRESERVASI: 0,
      NIK: '',
      IDPOLI: '',
      IDDOKTER: '',
      TANGGALRESERVASI: '',
      JAMRESERVASI: '',
      STATUS: 'Menunggu',
      KETERANGAN: '',
    });
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Reservasi Pasien</h3>

      <HeaderBar
        title=""
        placeholder="Cari NIK atau Nama Dokter..."
        onSearch={handleSearch}
        onAddClick={() => {
          resetForm();
          setDialogVisible(true);
        }}
      />

      <TabelReservasiPasien
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormReservasiPasien
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
        }}
        onChange={setFormData}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        pasienOptions={pasienOptions}
        poliOptions={poliOptions}
        dokterOptions={dokterOptions}
      />
    </div>
  );
};

export default ReservasiPasienPage;