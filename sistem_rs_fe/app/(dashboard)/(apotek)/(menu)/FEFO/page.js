'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import HeaderBar from '@/app/components/headerbar';
import TabelFefo from './components/tabelFefo';
import ToastNotifier from '@/app/components/toastNotifier';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { InputNumber } from 'primereact/inputnumber';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const toastRef = useRef(null);

  useEffect(() => {
    fetchFefo();
  }, []);

  // === FETCH DATA FEFO ===
  const fetchFefo = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/fefo`);
      setData(res.data.data || []);
    } catch (err) {
      console.error('Gagal ambil data FEFO:', err);
    } finally {
      setLoading(false);
    }
  };

  // === KOREKSI STOK ===
  const handleKoreksiStok = (row, newStok) => {
    confirmDialog({
      message: `Yakin ubah stok batch '${row.NAMAITEM}' menjadi ${newStok}?`,
      header: 'Konfirmasi Koreksi',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await axios.put(`${API_URL}/fefo/${row.IDBATCH}`, { STOK: newStok });
          fetchFefo();
          toastRef.current?.showToast('00', 'Stok berhasil dikoreksi');
        } catch (err) {
          toastRef.current?.showToast('01', 'Gagal koreksi stok');
        }
      },
    });
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <HeaderBar
        title="FEFO - Monitoring Batch"
        placeholder="Cari nama item"
        onSearch={(keyword) => {
          if (!keyword) return fetchFefo();
          const lower = keyword.toLowerCase();
          setData(data.filter((d) => d.NAMAITEM?.toLowerCase().includes(lower)));
        }}
      />

      <TabelFefo
        data={data}
        loading={loading}
        onKoreksiStok={handleKoreksiStok}
      />
    </div>
  );
}