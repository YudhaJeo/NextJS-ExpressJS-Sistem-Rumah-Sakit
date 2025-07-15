'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import FilterTanggal from '@/app/components/filterTanggal';
import TabelRiwayatKunjungan from './components/tabelRiwayatKunjungan';


const API_URL = process.env.NEXT_PUBLIC_API_URL;

const RiwayatKunjunganPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);  

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); 
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/riwayatkunjungan`);
      setData(res.data.data);
    } catch (err) {
      console.error('Gagal mengambil data:', err);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">Riwayat Kunjungan</h3>

        <FilterTanggal
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          handleDateFilter={handleDateFilter}
          resetFilter={resetFilter}
        />

        <TabelRiwayatKunjungan data={data} loading={loading} />

    </div>
  );
};

export default RiwayatKunjunganPage;