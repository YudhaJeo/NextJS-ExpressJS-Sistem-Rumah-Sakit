'use client';

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import HeaderBar from "@/app/components/headerbar";
import ToastNotifier from "@/app/components/toastNotifier";
import TabelLaporanKomisi from "./components/tabelLaporanKomisi";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const LaporanKomisiPage = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const toastRef = useRef(null);
  const router = useRouter();

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

      <HeaderBar
        placeholder="Cari nama dokter/pasien..."
        onSearch={handleSearch}
      />

      <TabelLaporanKomisi data={data} loading={loading} />
    </div>
  );
};

export default LaporanKomisiPage;
