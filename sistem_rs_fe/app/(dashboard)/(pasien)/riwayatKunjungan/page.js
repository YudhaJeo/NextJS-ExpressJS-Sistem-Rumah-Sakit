'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import TabelRiwayatKunjungan from './components/tabelRiwayatKunjungan';
import { Column } from 'primereact/column';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const RiwayatKunjunganPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const formatTanggal = (tanggal) => {
    if (!tanggal) return '-';
    const tgl = new Date(tanggal);
    return tgl.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">Riwayat Kunjungan</h3>

      <TabelRiwayatKunjungan data={data} loading={loading} />

      {/* <DataTable value={data} loading={loading} paginator rows={10}>
        <Column field="NAMALENGKAP" header="Nama Pasien" />
        <Column field="NIK" header="NIK" />
        <Column field="TANGGALKUNJUNGAN" header="Tgl Kunjungan" body={(row) => formatTanggal(row.TANGGALKUNJUNGAN)} />
        <Column field="KELUHAN" header="Keluhan" />
        <Column field="POLI" header="Poli" />
        <Column field="STATUSKUNJUNGAN" header="Status Kunjungan" />
      </DataTable> */}
    </div>
  );
};

export default RiwayatKunjunganPage;