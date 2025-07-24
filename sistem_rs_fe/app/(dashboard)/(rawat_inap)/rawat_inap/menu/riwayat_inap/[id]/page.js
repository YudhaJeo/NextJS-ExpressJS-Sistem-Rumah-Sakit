// sistem_rs_fe\app\(dashboard)\(rawat_inap)\rawat_inap\menu\riwayat_inap\[id]\page.js
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';

// PrimeReact Components
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { Divider } from 'primereact/divider';
import { Panel } from 'primereact/panel';

import ToastNotifier from '@/app/components/toastNotifier';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DetailRiwayatInapPage() {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const router = useRouter();
  const { id } = useParams();
  const toastRef = useRef(null);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) return router.push('/login');
    fetchDetail(token);
  }, [id]);

  const fetchDetail = async (token) => {
    try {
      const res = await axios.get(`${API_URL}/riwayat_inap/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDetail(res.data.data);
      
      // Prepare services data for DataTable
      const servicesData = [];
      
      // Add room service
      servicesData.push({
        id: 1,
        layanan: `Biaya Kamar Rawat Inap (Bed ${res.data.data.NOMORBED})`,
        qty: 1,
        jenis: 'Kamar',
        hargaSatuan: res.data.data.TOTAL_HARGA_KAMAR,
        total: res.data.data.TOTAL_HARGA_KAMAR,
        type: 'kamar'
      });

      // Add medicines
      res.data.data.obat?.forEach((obat, index) => {
        servicesData.push({
          id: index + 2,
          layanan: obat.NAMAOBAT,
          satuan: obat.SATUAN,
          qty: obat.JUMLAH,
          jenis: 'Obat',
          hargaSatuan: obat.HARGA,
          total: obat.TOTAL,
          type: 'obat'
        });
      });

      // Add procedures
      res.data.data.tindakan?.forEach((tindakan, index) => {
        servicesData.push({
          id: (res.data.data.obat?.length || 0) + index + 2,
          layanan: tindakan.NAMATINDAKAN,
          kategori: tindakan.KATEGORI,
          qty: tindakan.JUMLAH,
          jenis: 'Tindakan',
          hargaSatuan: tindakan.HARGA,
          total: tindakan.TOTAL,
          type: 'tindakan'
        });
      });

      setServices(servicesData);
    } catch (err) {
      console.error('Gagal ambil detail:', err);
      toastRef.current?.showToast('01', 'Gagal mengambil detail rawat inap');
    } finally {
      setLoading(false);
    }
  };

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    const tgl = new Date(tanggal);
    return tgl.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatRupiah = (value) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(value || 0);

  // Column templates
  const noBodyTemplate = (rowData, { rowIndex }) => {
    return rowIndex + 1;
  };

  const layananBodyTemplate = (rowData) => {
    return (
      <div>
        <div className="font-medium">{rowData.layanan}</div>
        {rowData.satuan && <div className="text-sm text-gray-500">{rowData.satuan}</div>}
        {rowData.kategori && <div className="text-sm text-gray-500">{rowData.kategori}</div>}
      </div>
    );
  };

  const jenisBodyTemplate = (rowData) => {
    let severity = 'success';
    if (rowData.type === 'obat') severity = 'info';
    if (rowData.type === 'tindakan') severity = 'warning';
    
    return <Tag value={rowData.jenis} severity={severity} />;
  };

  const hargaBodyTemplate = (rowData) => {
    return <div className="text-right font-medium">{formatRupiah(rowData.hargaSatuan)}</div>;
  };

  const totalBodyTemplate = (rowData) => {
    return <div className="text-right font-medium">{formatRupiah(rowData.total)}</div>;
  };

  const qtyBodyTemplate = (rowData) => {
    return <div className="text-center">{rowData.qty}</div>;
  };

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <ProgressSpinner />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Message severity="warn" text="Tidak ada data ditemukan." />
      </div>
    );
  }

  // Header template untuk card
  const headerTemplate = (
    <div className="bg-primary text-white p-4 text-center">
      <h1 className="text-2xl font-bold m-0">Detail Rawat Inap</h1>
      <p className="m-1 opacity-90">ID Transaksi: #{detail?.IDRAWATINAP || id}</p>
    </div>
  );

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      
      <div className="max-w-6xl mx-auto">
        <Card className="shadow-3">
          {/* Custom Header */}
          {headerTemplate}
          
          {/* Patient Information */}
          <div className="p-4">
            <div className="grid">
              <div className="col-12 md:col-4">
                <Panel header="Informasi Pasien" className="h-full">
                  <div className="pt-2">
                    <div className="text-lg font-semibold text-900 mb-2">{detail.NAMALENGKAP}</div>
                    <div className="text-sm text-600">
                      <strong>No. Bed:</strong> {detail.NOMORBED}
                    </div>
                  </div>
                </Panel>
              </div>

              <div className="col-12 md:col-4">
                <Panel header="Periode Rawat Inap" className="h-full">
                  <div className="pt-2">
                    <div className="text-sm text-600 mb-2">
                      <strong>Masuk:</strong> {formatTanggal(detail.TANGGALMASUK)}
                    </div>
                    <div className="text-sm text-600">
                      <strong>Keluar:</strong> {formatTanggal(detail.TANGGALKELUAR)}
                    </div>
                  </div>
                </Panel>
              </div>

              <div className="col-12 md:col-4">
                <Panel header="ID Rawat Inap" className="h-full">
                  <div className="pt-2">
                    <div className="text-lg font-semibold text-900">#{detail.IDRAWATINAP}</div>
                  </div>
                </Panel>
              </div>
            </div>

            <Divider />

            {/* Services Table */}
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-900 mb-3">Rincian Layanan</h3>
              
              <DataTable 
                value={services} 
                stripedRows 
                showGridlines
                responsiveLayout="scroll"
                className="p-datatable-customers"
              >
                <Column 
                  field="id" 
                  header="#" 
                  body={noBodyTemplate}
                  style={{ width: '60px' }}
                />
                <Column 
                  field="layanan"
                  header="Layanan"
                  body={layananBodyTemplate}
                  style={{ minWidth: '200px' }}
                />
                <Column 
                  field="qty"
                  header="Qty"
                  body={qtyBodyTemplate}
                  style={{ width: '80px' }}
                />
                <Column 
                  field="jenis"
                  header="Jenis"
                  body={jenisBodyTemplate}
                  style={{ width: '120px' }}
                />
                <Column 
                  field="hargaSatuan"
                  header="Harga Satuan"
                  body={hargaBodyTemplate}
                  style={{ width: '150px' }}
                />
                <Column 
                  field="total"
                  header="Total"
                  body={totalBodyTemplate}
                  style={{ width: '150px' }}
                />
              </DataTable>
            </div>

            <Divider />

            {/* Total Section */}
            <div className="grid">
              <div className="col-12 md:col-6 md:col-offset-6">
                <Panel header="Ringkasan Biaya" className="bg-gray-50">
                  <div className="pt-2">
                    <div className="flex justify-content-between mb-2">
                      <span className="text-600">Biaya Kamar:</span>
                      <span className="font-medium">{formatRupiah(detail.TOTAL_HARGA_KAMAR)}</span>
                    </div>
                    
                    <div className="flex justify-content-between mb-2">
                      <span className="text-600">Total Obat:</span>
                      <span className="font-medium">{formatRupiah(detail.TOTALOBAT)}</span>
                    </div>
                    
                    <div className="flex justify-content-between mb-3">
                      <span className="text-600">Total Tindakan:</span>
                      <span className="font-medium">{formatRupiah(detail.TOTALTINDAKAN)}</span>
                    </div>
                    
                    <Divider />
                    
                    <div className="flex justify-content-between">
                      <span className="text-lg font-semibold text-900">Total Biaya:</span>
                      <span className="text-lg font-semibold text-primary">{formatRupiah(detail.TOTALBIAYA)}</span>
                    </div>
                  </div>
                </Panel>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-4 p-3 bg-gray-50 border-round">
              <p className="text-sm text-600 m-0">
                Terima kasih atas kepercayaan anda menggunakan layanan kami
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}