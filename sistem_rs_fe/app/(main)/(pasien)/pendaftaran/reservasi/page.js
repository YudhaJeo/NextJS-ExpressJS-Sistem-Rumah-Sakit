"use client";

import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import TabelReservasiPasien from './components/tabelReservasi';
import FormReservasiPasien from './components/formReservasi';
import HeaderBar from '@/app/components/headerbar';
import FilterTanggal from '@/app/components/filterTanggal';
import ToastNotifier from '@/app/components/toastNotifier';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { getHariFromTanggal } from '@/utils/dataHelper';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ReservasiPasienPage = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [allDokterOptions, setAllDokterOptions] = useState([]);
  const [errors, setErrors] = useState({});


  const [formData, setFormData] = useState({
    IDRESERVASI: 0,
    NIK: '',
    IDPOLI: '',
    IDDOKTER: '',
    TANGGALRESERVASI: '',
    JAMRESERVASI: '',
    KETERANGAN: '',
    STATUS: 'Menunggu',
  });

  const [pasienOptions, setPasienOptions] = useState([]);
  const [poliOptions, setPoliOptions] = useState([]);
  const [dokterOptions, setDokterOptions] = useState([]);


  const toastRef = useRef(null);

  useEffect(() => {
    fetchReservasi();
    fetchPasien();
    fetchPoli();
    fetchDokter();
  }, []);

  const fetchReservasi = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/reservasi`);
      const transformed = transformJadwalHariIni(res.data);
      setData(transformed);
      setOriginalData(transformed);
    } catch (err) {
      console.error('Gagal mengambil data:', err);
    } finally {
      setLoading(false);
    }
  };

  const transformJadwalHariIni = (list) => {
    return list.map((item) => {
      const hariReservasi = getHariFromTanggal(item.TANGGALRESERVASI).toLowerCase();
      const semuaJadwal = item.JADWALPRAKTEK || [];

      const jadwalHariIni = semuaJadwal
        .map((j) => j.trim())
        .filter((j) => j.toLowerCase().includes(hariReservasi))
        .join(', ') || '-';

      return {
        ...item,
        JADWAL_PRAKTEK_HARI_INI: jadwalHariIni,
      };
    });
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

      const options = res.data.map((poli) => ({
        label: `${poli.NAMAPOLI}`,
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

      const options = res.data.map((dokter) => {
        let jadwal = [];

        if (typeof dokter.JADWALPRAKTEK === "string") {
          jadwal = dokter.JADWALPRAKTEK
            .split(",")
            .map((j) => j.trim())
            .filter(Boolean);
        }

        else if (Array.isArray(dokter.JADWALPRAKTEK)) {
          jadwal = dokter.JADWALPRAKTEK;
        }

        return {
          label: dokter.NAMALENGKAP,
          value: dokter.IDDOKTER,
          IDPOLI: dokter.IDPOLI,
          NAMALENGKAP: dokter.NAMALENGKAP,
          JADWALPRAKTEK: jadwal,
        };
      });

      setDokterOptions(options);
      setAllDokterOptions(options);
    } catch (err) {
      console.error("Gagal ambil data dokter:", err);
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.NIK.trim()) newErrors.NIK = <span style={{ color: 'red' }}>NIK wajib diisi</span>;
    if (!formData.TANGGALRESERVASI.trim()) newErrors.TANGGALRESERVASI = <span style={{ color: 'red' }}>Tanggal Reservasi wajib diisi</span>;
    if (!formData.IDPOLI) newErrors.IDPOLI = <span style={{ color: 'red' }}>Poli wajib dipilih</span>;
    if (!formData.IDDOKTER) newErrors.IDDOKTER = <span style={{ color: 'red' }}>Dokter wajib dipilih</span>;
    if (!formData.JAMRESERVASI) newErrors.JAMRESERVASI = <span style={{ color: 'red' }}>Jam wajib dipilih</span>;
    if (!formData.KETERANGAN.trim()) newErrors.KETERANGAN = <span style={{ color: 'red' }}>Keluhan wajib dipilih</span>;
    if (!formData.STATUS.trim()) newErrors.STATUS = <span style={{ color: 'red' }}>Status wajib dipilih</span>;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async () => {
    if (!validateForm()) return;

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

  const handleDateFilter = () => {
    if (!startDate && !endDate) return setData(originalData);
    const filtered = originalData.filter((item) => {
      const visitDate = new Date(item.TANGGALKUNJUNGAN);
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

  const resetForm = () => {
    setFormData({
      IDRESERVASI: 0,
      NIK: '',
      TANGGALRESERVASI: '',
      IDPOLI: '',
      IDDOKTER: '',
      KETERANGAN: '',
      STATUS: 'Menunggu',
    });
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Reservasi Pasien</h3>
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
        errors={errors}
        pasienOptions={pasienOptions}
        poliOptions={poliOptions}
        dokterOptions={dokterOptions}
        setDokterOptions={setDokterOptions}
        allDokterOptions={allDokterOptions}
      />
    </div>
  );
};

export default ReservasiPasienPage;