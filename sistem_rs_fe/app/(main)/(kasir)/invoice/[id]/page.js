'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { Panel } from 'primereact/panel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import ToastNotifier from '@/app/components/toastNotifier';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const statusLabels = {
  BELUM_LUNAS: 'Belum Dibayar',
  LUNAS: 'Sudah Dibayar',
};

const statusSeverity = {
  BELUM_LUNAS: 'danger',
  LUNAS: 'success',
};

export default function InvoiceDetailPage() {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const { id } = useParams();
  const toastRef = useRef(null);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const res = await axios.get(`${API_URL}/invoice/${id}`);
      const data = res.data.data || null;
      setInvoice(data);

      if (data?.IDRIWAYATINAP) {
        const servicesData = [];

        servicesData.push({
          id: 1,
          layanan: `Biaya Kamar Rawat Inap (Bed ${data.NOMORBED || "-"})`,
          qty: 1,
          jenis: 'Kamar',
          hargaSatuan: data.TOTALKAMAR,
          total: data.TOTALKAMAR,
          type: 'kamar'
        });

        data.obat?.forEach((obat, index) => {
          servicesData.push({
            id: index + 2,
            layanan: obat.NAMAOBAT,
            satuan: obat.JENISOBAT,
            qty: obat.JUMLAH,
            jenis: 'Obat',
            hargaSatuan: obat.HARGA,
            total: obat.TOTAL,
            type: 'obat'
          });
        });

        data.alkes?.forEach((alkes, index) => {
          servicesData.push({
            id: (data.obat?.length || 0) + index + 2,
            layanan: alkes.NAMAALKES,
            satuan: alkes.JENISALKES,
            qty: alkes.JUMLAH,
            jenis: 'Alkes',
            hargaSatuan: alkes.HARGA,
            total: alkes.TOTAL,
            type: 'alkes'
          });
        });

        data.tindakanInap?.forEach((tindakan, index) => {
          servicesData.push({
            id: (data.obat?.length || 0) + (data.alkes?.length || 0) + index + 2,
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
      }
    } catch (err) {
      console.error('Gagal ambil invoice:', err);
      toastRef.current?.showToast('01', 'Gagal mengambil data invoice');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(value || 0);

  const formatTanggal = (tanggal) => {
    if (!tanggal) return '-';
    return new Date(tanggal).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

  const noBodyTemplate = (_, { rowIndex }) => rowIndex + 1;
  const layananBodyTemplate = (rowData) => (
    <div>
      <div className="font-medium">{rowData.layanan}</div>
      {rowData.satuan && <div className="text-sm text-gray-500">{rowData.satuan}</div>}
      {rowData.kategori && <div className="text-sm text-gray-500">{rowData.kategori}</div>}
    </div>
  );
  const jenisBodyTemplate = (rowData) => {
    let severity = 'success';
    if (rowData.type === 'obat') severity = 'info';
    if (rowData.type === 'alkes') severity = 'info';
    if (rowData.type === 'tindakan') severity = 'warning';
    return <Tag value={rowData.jenis} severity={severity} />;
  };
  const hargaBodyTemplate = (rowData) => <div className="text-right font-medium">{formatCurrency(rowData.hargaSatuan)}</div>;
  const totalBodyTemplate = (rowData) => <div className="text-right font-medium">{formatCurrency(rowData.total)}</div>;
  const qtyBodyTemplate = (rowData) => <div className="text-center">{rowData.qty}</div>;

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <ProgressSpinner />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Message severity="warn" text="Data invoice tidak ditemukan." />
      </div>
    );
  }

  const totalKamar = num(invoice.TOTALKAMAR);
  const totalObat = num(invoice.TOTALOBAT);
  const totalAlkes = num(invoice.TOTALALKES);
  const totalTindakan = num(invoice.TOTALTINDAKAN);
  const totalBiaya = num(invoice.TOTALBIAYA) || totalKamar + totalObat + totalTindakan;
  const totalTagihan = num(invoice.TOTALTAGIHAN) || totalBiaya;
  const totalDeposit = num(invoice.TOTALDEPOSIT);
  const totalAngsuran = num(invoice.TOTALANGSURAN);
  const sisaTagihan = num(invoice.SISA_TAGIHAN) || (totalTagihan - totalDeposit - totalAngsuran);
  const totalBiayaJalan = num(invoice.TOTALBIAYAJALAN);
  const totalTindakanJalan = Array.isArray(invoice.tindakanJalan)
    ? invoice.tindakanJalan.reduce((sum, t) => sum + num(t.TOTAL), 0)
    : 0;

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <div className="max-w-6xl mx-auto space-y-4">

        {invoice.IDRIWAYATJALAN && (
          <Card className="shadow-3">
            <div className="bg-primary text-white p-4 text-center">
              <h1 className="text-2xl font-bold m-0">Detail Rawat Jalan</h1>
              <p className="m-1 opacity-90">ID Transaksi: #{invoice.IDRIWAYATJALAN}</p>
            </div>

            <div className="p-4">
              <div className="grid">
                <div className="col-12 md:col-6">
                  <Panel header="Informasi Pasien" className="h-full">
                    <div className="pt-2">
                      <div className="text-lg font-semibold text-900 mb-2">{invoice.NAMAPASIEN}</div>
                    </div>
                  </Panel>
                </div>

                <div className="col-12 md:col-6">
                  <Panel header="Tanggal Rawat Jalan" className="h-full">
                    <div className="pt-2">
                      <div className="text-sm text-600">
                        <strong>Tanggal:</strong> {formatTanggal(invoice.TANGGALRAWATJALAN)}
                      </div>
                    </div>
                  </Panel>
                </div>
              </div>

              <Divider />

              <div className="mb-4">
                <h3 className="text-xl font-semibold text-900 mb-3">Rincian Layanan</h3>

                <DataTable value={(invoice.tindakanJalan || []).map((t, i) => ({
                  id: i + 1,
                  layanan: t.NAMATINDAKAN,
                  kategori: t.KATEGORI,
                  qty: t.JUMLAH,
                  jenis: 'Tindakan',
                  hargaSatuan: t.HARGA,
                  total: t.TOTAL,
                  type: 'tindakan'
                }))} stripedRows showGridlines responsiveLayout="scroll">
                  <Column field="id" header="#" body={noBodyTemplate} style={{ width: '60px' }} />
                  <Column field="layanan" header="Layanan" body={layananBodyTemplate} style={{ minWidth: '200px' }} />
                  <Column field="qty" header="Qty" body={qtyBodyTemplate} style={{ width: '80px' }} />
                  <Column field="jenis" header="Jenis" body={jenisBodyTemplate} style={{ width: '120px' }} />
                  <Column field="hargaSatuan" header="Harga Satuan" body={hargaBodyTemplate} style={{ width: '150px' }} />
                  <Column field="total" header="Total" body={totalBodyTemplate} style={{ width: '150px' }} />
                </DataTable>
              </div>

              <Divider />

              <div className="grid">
                <div className="col-12 md:col-6 md:col-offset-6">
                  <Panel header="Ringkasan Biaya" className="bg-gray-50">
                    <div className="pt-2">
                      <div className="flex justify-content-between mb-2">
                        <span className="text-600">Total Tindakan:</span>
                        <span className="font-medium">{formatCurrency(totalTindakanJalan)}</span>
                      </div>

                      <Divider />

                      <div className="flex justify-content-between">
                        <span className="text-lg font-semibold text-900">Total Biaya:</span>
                        <span className="text-lg font-semibold text-primary">{formatCurrency(totalBiayaJalan)}</span>
                      </div>
                    </div>
                  </Panel>
                </div>
              </div>
            </div>
          </Card>
        )}

        {invoice.IDRIWAYATINAP && (
          <Card className="shadow-3">
            <div className="bg-green-600 text-white p-4 text-center">
              <h1 className="text-2xl font-bold m-0">Detail Rawat Inap</h1>
              <p className="m-1 opacity-90">ID Transaksi: #{invoice.IDRIWAYATINAP}</p>
            </div>

            <div className="p-4">
              <div className="grid">
                <div className="col-12 md:col-6">
                  <Panel header="Informasi Pasien" className="h-full">
                    <div className="pt-2">
                      <div className="text-lg font-semibold text-900 mb-2">{invoice.NAMAPASIEN}</div>
                      <div className="text-sm text-600">
                        <strong>No. Bed:</strong> {invoice.NOMORBED}
                      </div>
                    </div>
                  </Panel>
                </div>

                <div className="col-12 md:col-6">
                  <Panel header="Periode Rawat Inap" className="h-full">
                    <div className="pt-2">
                      <div className="text-sm text-600 mb-2">
                        <strong>Masuk:</strong> {formatTanggal(invoice.TANGGALMASUK)}
                      </div>
                      <div className="text-sm text-600">
                        <strong>Keluar:</strong> {formatTanggal(invoice.TANGGALKELUAR)}
                      </div>
                    </div>
                  </Panel>
                </div>
              </div>

              <Divider />

              <div className="mb-4">
                <h3 className="text-xl font-semibold text-900 mb-3">Rincian Layanan</h3>

                <DataTable value={services} stripedRows showGridlines responsiveLayout="scroll">
                  <Column field="id" header="#" body={noBodyTemplate} style={{ width: '60px' }} />
                  <Column field="layanan" header="Layanan" body={layananBodyTemplate} style={{ minWidth: '200px' }} />
                  <Column field="qty" header="Qty" body={qtyBodyTemplate} style={{ width: '80px' }} />
                  <Column field="jenis" header="Jenis" body={jenisBodyTemplate} style={{ width: '120px' }} />
                  <Column field="hargaSatuan" header="Harga Satuan" body={hargaBodyTemplate} style={{ width: '150px' }} />
                  <Column field="total" header="Total" body={totalBodyTemplate} style={{ width: '150px' }} />
                </DataTable>
              </div>

              <Divider />

              <div className="grid">
                <div className="col-12 md:col-6 md:col-offset-6">
                  <Panel header="Ringkasan Biaya" className="bg-gray-50">
                    <div className="pt-2">
                      <div className="flex justify-content-between mb-2">
                        <span className="text-600">Biaya Kamar:</span>
                        <span className="font-medium">{formatCurrency(totalKamar)}</span>
                      </div>
                      <div className="flex justify-content-between mb-2">
                        <span className="text-600">Total Obat:</span>
                        <span className="font-medium">{formatCurrency(totalObat)}</span>
                      </div>
                      <div className="flex justify-content-between mb-2">
                        <span className="text-600">Total Alkes:</span>
                        <span className="font-medium">{formatCurrency(totalAlkes)}</span>
                      </div>
                      <div className="flex justify-content-between mb-3">
                        <span className="text-600">Total Tindakan:</span>
                        <span className="font-medium">{formatCurrency(totalTindakan)}</span>
                      </div>

                      <Divider />

                      <div className="flex justify-content-between">
                        <span className="text-lg font-semibold text-900">Total Biaya:</span>
                        <span className="text-lg font-semibold text-primary">{formatCurrency(totalBiaya)}</span>
                      </div>
                    </div>
                  </Panel>
                </div>
              </div>
            </div>
          </Card>
        )}

        {invoice.NOINVOICE && (
          <Card className="shadow-3">
            <div className="bg-primary text-white p-4 text-center">
              <h1 className="text-2xl font-bold m-0">Detail Invoice</h1>
              <p className="m-1 opacity-90">No Invoice: #{invoice.NOINVOICE}</p>
            </div>

            <div className="p-4">
              <div className="grid">
                <div className="col-12 md:col-6">
                  <Panel header="Informasi Pasien" className="h-full">
                    <div className="pt-2">
                      <div className="text-sm text-600 mb-2">
                        <strong>Nama Pasien:</strong> {invoice.NAMAPASIEN}
                      </div>
                      <div className="text-sm text-600 mb-2">
                        <strong>NIK:</strong> {invoice.NIK}
                      </div>
                      <div className="text-sm text-600">
                        <strong>Asuransi:</strong> {invoice.ASURANSI}
                      </div>
                    </div>
                  </Panel>
                </div>

                <div className="col-12 md:col-6">
                  <Panel header="Informasi Invoice" className="h-full">
                    <div className="pt-2">
                      <div className="text-sm text-600 mb-2">
                        <strong>No Invoice:</strong> {invoice.NOINVOICE}
                      </div>
                      <div className="text-sm text-600 mb-2">
                        <strong>Tanggal Invoice:</strong> {formatTanggal(invoice.TANGGALINVOICE)}
                      </div>
                      <div className="text-sm text-600">
                        <strong>Status:</strong> {invoice.STATUS}
                      </div>
                    </div>
                  </Panel>
                </div>
              </div>

              <div className="grid">
                <div className="col-12">
                  <Panel header="Ringkasan Biaya" className="bg-gray-50">
                    <div className="pt-2">
                      <div className="flex justify-content-between mb-2">
                        <span className="text-600">Total Tagihan:</span>
                        <span className="font-medium">{formatCurrency(totalTagihan)}</span>
                      </div>
                      <div className="flex justify-content-between mb-2">
                        <span className="text-600">Total Deposit:</span>
                        <span className="font-medium">{formatCurrency(totalDeposit)}</span>
                      </div>
                      <div className="flex justify-content-between mb-2">
                        <span className="text-600">Total Angsuran:</span>
                        <span className="font-medium">{formatCurrency(totalAngsuran)}</span>
                      </div>
                      <div className="flex justify-content-between mb-3">
                        <span className="text-600">Sisa Tagihan:</span>
                        <span className="font-medium">{formatCurrency(sisaTagihan)}</span>
                      </div>

                      <Divider />

                      <div className="flex justify-content-between">
                        <span className="text-lg font-semibold text-900">Status:</span>
                        <Tag
                          value={statusLabels[invoice.STATUS] || invoice.STATUS}
                          severity={statusSeverity[invoice.STATUS] || 'info'}
                        />
                      </div>
                    </div>
                  </Panel>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}