'use client';

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import HeaderBar from "@/app/components/headerbar";
import ToastNotifier from "@/app/components/toastNotifier";
import TabelPemesanan from "./components/tabelKartu"; // <-- gunakan tabel pemesanan
import DetailPemesanan from "./components/detailPemesanan"; // <-- modal detail
import FilterTanggal from "@/app/components/filterTanggal";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const MonitoringPemesananPage = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const toastRef = useRef(null);
  const router = useRouter();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // modal detail
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/pemesanan`);
      const apiData = Array.isArray(res.data) ? res.data : res.data.data;

      const filteredData = (apiData || [])
      .filter(item => item.STATUS === 'DITERIMA')
      .map(item => ({
        ...item,
        STATUS: 'MASUK'
      }));

      setData(filteredData);
      setOriginalData(filteredData);
    } catch (err) {
      console.error("Gagal mengambil data pemesanan:", err);
      toastRef.current?.showToast("01", "Gagal memuat data pemesanan");
    } finally {
      setLoading(false);
    }
  };

  const handleDetail = async (row) => {
    try {
      const res = await axios.get(`${API_URL}/pemesanan/${row.IDPEMESANAN}`);
      setDetailData(res.data);
      setDetailVisible(true);
    } catch (err) {
      toastRef.current?.showToast("01", "Gagal memuat detail pemesanan");
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
      const visitDate = new Date(item.TGLPEMESANAN);
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
        item.NAMASUPPLIER?.toLowerCase().includes(keyword.toLowerCase())
      );
      setData(filtered);
    }
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <h3 className="text-xl font-semibold mb-3">Kartu Stok Obat dan Alat Kesehatan</h3>

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
          placeholder="Cari berdasarkan supplier atau ID pemesanan..."
          onSearch={handleSearch}
        />
      </div>

      <TabelPemesanan data={data} loading={loading} onDetail={handleDetail} />

      <DetailPemesanan
        visible={detailVisible}
        onHide={() => setDetailVisible(false)}
        data={detailData}
      />
    </div>
  );
};

export default MonitoringPemesananPage;
