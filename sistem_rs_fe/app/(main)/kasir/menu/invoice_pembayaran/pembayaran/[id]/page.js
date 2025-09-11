'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { Panel } from 'primereact/panel';

import ToastNotifier from '@/app/components/toastNotifier';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const metodeSeverity = {
  CASH: 'success',
  TRANSFER: 'info',
  QRIS: 'warning',
};

export default function PembayaranDetailPage() {
  const [pembayaran, setPembayaran] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const toastRef = useRef(null);

  useEffect(() => {
    fetchPembayaran();
  }, [id]);

  const fetchPembayaran = async () => {
    try {
      const res = await axios.get(`${API_URL}/pembayaran/${id}`);
      setPembayaran(res.data.data || null);
    } catch (err) {
      console.error('Gagal ambil pembayaran:', err);
      toastRef.current?.showToast('01', 'Gagal mengambil data pembayaran');
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

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <ProgressSpinner />
      </div>
    );
  }

  if (!pembayaran) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Message severity="warn" text="Data pembayaran tidak ditemukan." />
      </div>
    );
  }

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <div className="max-w-4xl mx-auto space-y-4">
        <Card className="shadow-3">
          <div className="bg-primary text-white p-4 text-center">
            <h1 className="text-2xl font-bold m-0">Detail Pembayaran</h1>
            <p className="m-1 opacity-90">No Pembayaran: #{pembayaran.NOPEMBAYARAN}</p>
          </div>

          <div className="p-4">
            <div className="grid">
              <div className="col-12 md:col-6">
                <Panel header="Informasi Pasien" className="h-full">
                  <div className="pt-2 space-y-2">
                    <div className="text-sm text-600 mb-4">
                      <strong>Nama Pasien:</strong> {pembayaran.NAMAPASIEN}
                    </div>
                    <div className="text-sm text-600 mb-3">
                      <strong>NIK:</strong> {pembayaran.NIK}
                    </div>
                    <div className="text-sm text-600">
                      <strong>Asuransi:</strong> {pembayaran.ASURANSI || '-'}
                    </div>
                  </div>
                </Panel>
              </div>

              <div className="col-12 md:col-6">
                <Panel header="Informasi Pembayaran" className="h-full">
                  <div className="pt-2 space-y-2">
                    <div className="text-sm text-600 mb-2">
                      <strong>No Invoice:</strong> {pembayaran.NOINVOICE}
                    </div>
                    <div className="text-sm text-600 mb-2">
                      <strong>Tanggal Bayar:</strong> {formatTanggal(pembayaran.TANGGALBAYAR)}
                    </div>
                    <div className="text-sm text-600 mb-2">
                      <strong>Metode:</strong> {pembayaran.METODEPEMBAYARAN || '-'}
                    </div>
                    <div className="text-sm text-600">
                      <strong>Bank:</strong> {pembayaran.NAMA_BANK || '-'}
                    </div>
                  </div>
                </Panel>
              </div>
            </div>

            <Divider />

            <div className="grid">
              <div className="col-12">
                <Panel header="Ringkasan Pembayaran" className="bg-gray-50">
                  <div className="pt-2">
                    <div className="flex justify-content-between mb-2">
                      <span className="text-600">Jumlah Bayar:</span>
                      <span className="font-medium">{formatCurrency(pembayaran.JUMLAHBAYAR)}</span>
                    </div>
                  </div>
                </Panel>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}