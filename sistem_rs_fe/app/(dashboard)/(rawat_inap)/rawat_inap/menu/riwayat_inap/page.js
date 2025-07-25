// app/(dashboard)/(rawat_inap)/riwayat_inap/page.js
'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import HeaderBar from '@/app/components/headerbar';
import ToastNotifier from '@/app/components/toastNotifier';
import TabelRiwayatInap from './components/tabelRiwayatInap';
import FilterTanggal from '@/app/components/filterTanggal';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const toastRef = useRef(null);
  const router = useRouter();

  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/riwayat_inap`);
      setData(res.data.data);
      setOriginalData(res.data.data);
    } catch (err) {
      console.error('Gagal fetch riwayat inap:', err);
      toastRef.current?.showToast('01', 'Gagal mengambil data riwayat inap');
    } finally {
      setLoading(false);
    }
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
    if (!keyword) return setData(originalData);

    const filtered = originalData.filter((item) => {
      const nama = item.NAMALENGKAP?.toLowerCase() 
      return (
        nama.includes(keyword.toLowerCase()) 
      );
    });

    setData(filtered);
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <h3 className="text-xl font-semibold mb-3">Riwayat Rawat Inap</h3>

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
        />
      </div>

      <TabelRiwayatInap data={data} loading={loading} />
    </div>
  );
};

export default Page;