'use client';

import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import TabelKalender from './components/tabelKalender';
import FormDialogKalender from './components/formDialogKalender';
import HeaderBar from '@/app/components/headerbar';
import ToastNotifier from '@/app/components/toastNotifier';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const KalenderPage = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [allDokterOptions, setAllDokterOptions] = useState([]);
  const [formData, setFormData] = useState({
    ID: 0,
    IDDOKTER: '',
    KETERANGAN: '',
    TANGGAL: '',
    STATUS: '',
  });

  const [dokterOptions, setDokterOptions] = useState([]);
  const toastRef = useRef(null);
  const router = useRouter();
  const [refresh, setRefresh] = useState(false);
  const triggerRefresh = () => setRefresh(prev => !prev);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchKalender();
    fetchDokter();
  }, [refresh]);

  const fetchKalender = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/kalender`);
      setData(res.data);
      setOriginalData(res.data);
    } catch (err) {
      console.error('Gagal ambil data kalender:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDokter = async () => {
    try {
      const res = await axios.get(`${API_URL}/data_dokter`);
      const options = res.data.map((data_dokter) => ({
        label: `${data_dokter.NAMADOKTER}`,
        value: data_dokter.IDDOKTER,
      }));
      setDokterOptions(options);
      setAllDokterOptions(options);
    } catch (err) {
      console.error('Gagal ambil data Dokter:', err);
    }
  };

  const handleSubmit = async () => {
    const { ID, IDDOKTER, KETERANGAN, TANGGAL, STATUS } = formData;

    if (!IDDOKTER || !KETERANGAN || !TANGGAL || !STATUS) {
      toastRef.current?.showToast('01', 'Semua field wajib diisi!');
      return;
    }

    const formattedTanggal = TANGGAL?.slice(0, 10); // pastikan format yyyy-mm-dd

    const payload = {
      IDDOKTER,
      KETERANGAN,
      TANGGAL: formattedTanggal,
      STATUS,
    };

    try {
      if (ID && ID > 0) {
        await axios.put(`${API_URL}/kalender/${ID}`, payload);
        toastRef.current?.showToast('00', 'Berhasil diperbarui');
      } else {
        await axios.post(`${API_URL}/kalender`, payload);
        toastRef.current?.showToast('00', 'Berhasil ditambahkan');
      }

      setDialogVisible(false);
      resetForm();
      triggerRefresh();
    } catch (err) {
      console.error('Gagal simpan:', err.response || err);
      toastRef.current?.showToast('01', 'Gagal menyimpan data');
    }
  };

  const handleDateClick = (arg) => {
    setFormData({
      ID: 0,
      TANGGAL: arg.dateStr,
      STATUS: '',
      IDDOKTER: '',
      KETERANGAN: '',
    });
    setDialogVisible(true);
  };

  const handleEventClick = (info) => {
    setFormData({
      ID: info.ID,
      TANGGAL: info.TANGGAL?.slice(0, 10) ?? '',
      KETERANGAN: info.KETERANGAN,
      STATUS: info.STATUS,
      IDDOKTER: info.IDDOKTER,
    });
    setDialogVisible(true);
  };

  const handleDeleteSuccess = (row) => {
    confirmDialog({
      message: `Hapus data kalender tanggal ${row.TANGGAL}?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/kalender/${row.ID}`);
          toastRef.current?.showToast('00', 'Berhasil dihapus');
          setDialogVisible(false);
          resetForm();
          triggerRefresh();
        } catch (err) {
          console.error('Gagal hapus:', err);
          toastRef.current?.showToast('01', 'Gagal hapus data');
        }
      },
    });
  };

  const resetForm = () => {
    setFormData({
      ID: 0,
      IDDOKTER: '',
      KETERANGAN: '',
      TANGGAL: '',
      STATUS: '',
    });
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />
      <h3 className="text-xl font-semibold mb-3">Kalender Dokter</h3>

      <HeaderBar
        placeholder="Cari Dokter atau Tanggal..."
        onSearch={(keyword) => {
          if (!keyword) {
            setData(originalData);
          } else {
            const filtered = originalData.filter((item) =>
              item.IDDOKTER.toLowerCase().includes(keyword.toLowerCase()) ||
              item.TANGGAL.includes(keyword)
            );
            setData(filtered);
          }
        }}
        onAddClick={() => {
          resetForm();
          setDialogVisible(true);
        }}
      />

      <TabelKalender
        data={data}
        loading={loading}
        onDateClick={handleDateClick}
        onEventClick={handleEventClick}
        onDeleteSuccess={handleDeleteSuccess}
        refresh={refresh}
      />

      <FormDialogKalender
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
        }}
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onDelete={handleDeleteSuccess}
        dokterOptions={dokterOptions}
        allDokterOptions={allDokterOptions}
      />
    </div>
  );
};

export default KalenderPage;
