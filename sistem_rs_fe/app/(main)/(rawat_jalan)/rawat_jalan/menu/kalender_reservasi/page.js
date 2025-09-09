'use client';

import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import TabelKalender from './components/tabelKalenderReservasi';
import HeaderBar from '@/app/components/headerbar';
import ToastNotifier from '@/app/components/toastNotifier';
import { ConfirmDialog } from 'primereact/confirmdialog';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const KalenderPage = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const toastRef = useRef(null);
  const router = useRouter();
  const [refresh, setRefresh] = useState(false);
  const triggerRefresh = () => setRefresh(prev => !prev);

  useEffect(() => {
    fetchKalender();
  }, [refresh]);

  const fetchKalender = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/reservasi`);

      const filteredData = res.data.filter(item => item.STATUS?.toLowerCase() === 'DIKONFIRMASI');

      setData(filteredData);
      setOriginalData(filteredData);
    } catch (err) {
      console.error('Gagal ambil data reservasi:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />
      <h3 className="text-xl font-semibold mb-3">Kalender Reservasi</h3>

      <HeaderBar
        placeholder="Cari Nama Dokter atau Tanggal..."
        onSearch={(keyword) => {
          if (!keyword) {
            setData(originalData);
          } else {
            const filtered = originalData.filter((item) =>
              item.NAMA_DOKTER?.toLowerCase().includes(keyword.toLowerCase()) ||
              item.TANGGAL.includes(keyword)
            );
            setData(filtered);
          }
        }}
        onAddClick={null}  
      />

      <TabelKalender
        data={data}
        loading={loading}
      />
    </div>
  );
};

export default KalenderPage;
