'use client';

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import HeaderBar from "@/app/components/headerbar";
import ToastNotifier from "@/app/components/toastNotifier";
import TabelLaporanKomisi from "./components/tabelLaporanKomisi";
import FilterTanggal from "@/app/components/filterTanggal";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const LaporanKomisiPage = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const toastRef = useRef(null);
  const router = useRouter();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
  setLoading(true);
  try {
    const res = await axios.get(`${API_URL}/komisi_dokter`);
    const filtered = res.data.filter((item) => item.STATUS === 'Sudah Dibayar');

    setData(filtered);
    setOriginalData(filtered);
  } catch (err) {
    console.error("Gagal mengambil data komisi dokter:", err);
    toastRef.current?.showToast("01", "Gagal memuat data laporan");
  } finally {
    setLoading(false);
  }
};

const resetFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setData(originalData);
  };

const handleDateFilter = () => {
    if (!startDate && !endDate) return setData(originalData);
    const filtered = originalData.filter((item) => {
      const visitDate = new Date(item.TANGGALKUNJUNGAN);
      const from = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
      const to = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;
      return (!from || visitDate >= from) && (!to || visitDate <= to);
    });
    setData(filtered);
  };


  const handleSearch = (keyword) => {
    if (!keyword) {
      setData(originalData);
    } else {
      const filtered = originalData.filter((item) =>
        item.NAMADOKTER?.toLowerCase().includes(keyword.toLowerCase()) ||
        item.NAMAPASIEN?.toLowerCase().includes(keyword.toLowerCase())
      );
      setData(filtered);
    }
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <h3 className="text-xl font-semibold mb-3">Laporan Komisi Dokter</h3>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
              <FilterTanggal
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                handleDateFilter={handleDateFilter}
                resetFilter={resetFilter}
              />
              <HeaderBar
                placeholder="Cari nama dokter/pasien..."
                onSearch={handleSearch}
              />
        </div>

      <TabelLaporanKomisi data={data} loading={loading} />
    </div>
  );
};

export default LaporanKomisiPage;
