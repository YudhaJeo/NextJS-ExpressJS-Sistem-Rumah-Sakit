'use client';

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ToastNotifier from "@/app/components/toastNotifier";
import HeaderBar from "@/app/components/headerbar";
import FilterTanggal from "@/app/components/filterTanggal";
import { ConfirmDialog } from "primereact/confirmdialog";
import TabelPengobatan from "./components/tabelRiwayat"; 

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const RiwayatFromPendaftaranPage = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const toastRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/pendaftaran`);
      setData(res.data.data);
      setOriginalData(res.data.data);
    } catch (err) {
      console.error("Gagal ambil data pendaftaran:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (keyword) => {
    if (!keyword) return setData(originalData);
    const filtered = originalData.filter((item) =>
      item.NAMALENGKAP.toLowerCase().includes(keyword.toLowerCase()) ||
      item.NIK.toLowerCase().includes(keyword.toLowerCase())
    );
    setData(filtered);
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
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Monitoring Riwayat dari Pendaftaran</h3>

      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
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
          hideAddButton
        />
      </div>

      <TabelPengobatan data={data} loading={loading} />
    </div>
  );
};

export default RiwayatFromPendaftaranPage;
