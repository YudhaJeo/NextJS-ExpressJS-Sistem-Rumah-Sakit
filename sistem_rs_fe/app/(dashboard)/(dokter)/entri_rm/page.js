'use client';

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import HeaderBar from "@/app/components/headerbar";
import ToastNotifier from "@/app/components/toastNotifier";
import TabelEntriDokter from "./components/tabelEntriDokter";
import FilterTanggal from "@/app/components/filterTanggal";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const EntriDokterPage = () => {
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
      const res = await axios.get(`${API_URL}/dokumen`);
      let list = res.data.data || [];

      setData(list);
      setOriginalData(list);

    } catch (err) {
      console.error("Gagal ambil data monitoring:", err);
      toastRef.current?.showToast("01", "Gagal mengambil data dari server");
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
        item.NIK?.toLowerCase().includes(keyword.toLowerCase()) ||
        item.NAMALENGKAP?.toLowerCase().includes(keyword.toLowerCase())
      );
      setData(filtered);
    }
  };

  const handleDownload = async (row) => {
    try {
      const response = await axios.get(`${API_URL}/dokumen/download-by-id/${row.IDDOKUMEN}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', row.NAMAFILE);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Gagal mengunduh file:', error);
      showToast('error', 'Gagal Download', 'Tidak dapat mengunduh file.');
    }
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <h3 className="text-xl font-semibold mb-3">Entri Drawing Rekam Medis Dokter</h3>

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

      <TabelEntriDokter data={data} loading={loading} onDownload={handleDownload} />
    </div>
  );
};

export default EntriDokterPage;
