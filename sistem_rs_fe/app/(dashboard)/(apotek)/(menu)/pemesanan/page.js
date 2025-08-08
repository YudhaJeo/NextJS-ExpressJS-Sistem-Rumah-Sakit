"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import HeaderBar from "@/app/components/headerbar";
import TabelPemesanan from "./components/tabelPemesanan";
import FormPemesanan from "./components/formPemesanan";
import DetailPemesanan from "./components/detailPemesanan";
import ToastNotifier from "@/app/components/toastNotifier";
import { ConfirmDialog } from "primereact/confirmdialog";
import FilterTanggal from "@/app/components/filterTanggal";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const PagePemesanan = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [obat, setObat] = useState([]);
  const [alkes, setAlkes] = useState([]);

  const toastRef = useRef(null);

  const fetchPemesanan = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/pemesanan`);
      setData(res.data.data);
      setOriginalData(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchMasterData = async () => {
    const [resSup, resObat, resAlkes] = await Promise.all([
      axios.get(`${API_URL}/supplier`),
      axios.get(`${API_URL}/obat`),
      axios.get(`${API_URL}/alkes`)
    ]);
    setSuppliers(resSup.data);
    setObat(resObat.data.data);
    setAlkes(resAlkes.data.data);
  };

  const handleSearch = (keyword) => {
    if (!keyword) return setData(originalData);
    const filtered = originalData.filter((item) =>
      item.NAMASUPPLIER?.toLowerCase().includes(keyword.toLowerCase())
    );
    setData(filtered);
  };

  const handleDateFilter = () => {
    if (!startDate && !endDate) return setData(originalData);
    const filtered = originalData.filter((item) => {
      const visitDate = new Date(item.TGLPEMESANAN);
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

  const handleDetail = async (row) => {
    const res = await axios.get(`${API_URL}/pemesanan/${row.IDPEMESANAN}`);
    setDetailData(res.data);
    setDetailVisible(true);
  };

  const handleAccept = async (row) => {
    await axios.put(`${API_URL}/pemesanan/${row.IDPEMESANAN}/status`, {
      STATUS: "DITERIMA"
    });
    fetchPemesanan();
    toastRef.current?.show({
      severity: "success",
      summary: "Berhasil",
      detail: "Pemesanan diterima"
    });
  };

  const handleCancel = async (row) => {
    await axios.put(`${API_URL}/pemesanan/${row.IDPEMESANAN}/status`, {
      STATUS: "DIBATALKAN"
    });
    fetchPemesanan();
    toastRef.current?.show({
      severity: "warn",
      summary: "Dibatalkan",
      detail: "Pemesanan dibatalkan"
    });
  };

  const handleSubmitForm = async (formData) => {
    await axios.post(`${API_URL}/pemesanan`, formData);
    fetchPemesanan();
    toastRef.current?.show({
      severity: "success",
      summary: "Berhasil",
      detail: "Pemesanan berhasil ditambahkan"
    });
  };

  useEffect(() => {
    fetchPemesanan();
    fetchMasterData();
  }, []);

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Pemesanan</h3>

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
          placeholder="Cari supplier..."
          onSearch={handleSearch}
          onAddClick={() => setDialogVisible(true)}
        />
      </div>

      <TabelPemesanan
        data={data}
        loading={loading}
        onDetail={handleDetail}
        onAccept={handleAccept}
        onCancel={handleCancel}
      />

      <FormPemesanan
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        onSubmit={handleSubmitForm}
        suppliers={suppliers}
        obat={obat}
        alkes={alkes}
      />

      <DetailPemesanan
        visible={detailVisible}
        onHide={() => setDetailVisible(false)}
        data={detailData}
      />
    </div>
  );
};

export default PagePemesanan;