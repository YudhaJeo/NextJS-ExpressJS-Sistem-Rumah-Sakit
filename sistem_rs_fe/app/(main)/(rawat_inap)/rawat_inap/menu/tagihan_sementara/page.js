'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import HeaderBar from '@/app/components/headerbar';
import TabelTagihanSementara from './components/tabelTagihanSementara';
import ToastNotifier from '@/app/components/toastNotifier';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const toastRef = useRef(null);

  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/tagihan_sementara`);
      setData(res.data.data);
      setOriginalData(res.data.data);
    } catch (err) {
      console.error('Gagal fetch tagihan sementara:', err);
      toastRef.current?.showToast('01', 'Gagal mengambil data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <h3 className="text-xl font-semibold mb-3">Tagihan Sementara</h3>

      <HeaderBar
        title=""
        placeholder="Cari nama pasien"
        onSearch={(keyword) => {
          if (!keyword) return setData(originalData);

          const filtered = originalData.filter((item) =>
            item.NAMALENGKAP?.toLowerCase().includes(keyword.toLowerCase())
          );

          setData(filtered);
        }}
      />

      <TabelTagihanSementara
        data={data}
        loading={loading}
      />
    </div>
  );
};

export default Page;
