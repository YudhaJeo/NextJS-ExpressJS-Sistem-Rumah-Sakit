'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { Button } from 'primereact/button';
import ToastNotifier from '@/app/components/toastNotifier';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
    `Rp ${Number(value || 0).toLocaleString('id-ID', { minimumFractionDigits: 0 })}`;

  const formatTanggal = (tanggal) => {
    if (!tanggal) return '-';
    return new Date(tanggal).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleCetak = () => {
    window.open(`/pembayaran/cetak/${id}`, '_blank');
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
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-3">
          <div className="bg-primary text-white p-4 text-center">
            <h1 className="text-2xl font-bold m-0">Detail Pembayaran</h1>
            <p className="m-1 opacity-90">No Pembayaran: #{pembayaran.NOPEMBAYARAN}</p>
          </div>

          <div className="p-4">
            <div className="grid">
              <div className="col-12 md:col-6">
                <h4>Informasi Pasien</h4>
                <Divider />
                <p><b>Nama:</b> {pembayaran.NAMAPASIEN}</p>
                <p><b>NIK:</b> {pembayaran.NIK}</p>
                <p><b>Asuransi:</b> {pembayaran.ASURANSI || '-'}</p>
              </div>

              <div className="col-12 md:col-6">
                <h4>Informasi Pembayaran</h4>
                <Divider />
                <p><b>No Invoice:</b> {pembayaran.NOINVOICE}</p>
                <p><b>Tanggal Bayar:</b> {formatTanggal(pembayaran.TANGGALBAYAR)}</p>
                <p><b>Metode:</b> {pembayaran.METODEPEMBAYARAN}</p>
                <p><b>Bank:</b> {pembayaran.NAMA_BANK || '-'}</p>
                <p><b>Jumlah Bayar:</b> {formatCurrency(pembayaran.JUMLAHBAYAR)}</p>
                <p><b>Keterangan:</b> {pembayaran.KETERANGAN || '-'}</p>
              </div>
            </div>

            <div className="text-center mt-4">
              <Button
                icon="pi pi-print"
                label="Cetak Pembayaran"
                severity="success"
                onClick={handleCetak}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}