"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import HeaderBar from "@/app/components/headerbar";
import TabelPemesanan from "./components/tabelPemesanan";
import FormPemesanan from "./components/formPemesanan";
import DetailPemesanan from "./components/detailPemesanan";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const PagePemesanan = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  const [detailData, setDetailData] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);

  // Tambah state untuk master data
  const [suppliers, setSuppliers] = useState([]);
  const [obat, setObat] = useState([]);
  const [alkes, setAlkes] = useState([]);

  // Fetch data pemesanan
  const fetchPemesanan = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/pemesanan`);
      setData(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  // Fetch master data untuk form
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

  // Event handler untuk aksi di tabel
  const handleDetail = async (row) => {
    const res = await axios.get(`${API_URL}/pemesanan/${row.IDPEMESANAN}`);
    setDetailData(res.data);
    setDetailVisible(true);
  };

  const handleAccept = async (row) => {
    await axios.put(`${API_URL}/pemesanan/${row.IDPEMESANAN}/status`, { STATUS: "DITERIMA" });
    fetchPemesanan();
  };

  const handleCancel = async (row) => {
    await axios.put(`${API_URL}/pemesanan/${row.IDPEMESANAN}/status`, { STATUS: "DIBATALKAN" });
    fetchPemesanan();
  };

  // Submit form ke server
  const handleSubmitForm = async (formData) => {
    await axios.post(`${API_URL}/pemesanan`, formData);
    fetchPemesanan();
  };

  useEffect(() => {
    fetchPemesanan();
    fetchMasterData(); 
  }, []);

  return (
    <div className="card">
      <HeaderBar
        title="Pemesanan"
        placeholder="Cari Pemesanan..."
        onAddClick={() => setDialogVisible(true)}
      />

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
}

export default PagePemesanan;