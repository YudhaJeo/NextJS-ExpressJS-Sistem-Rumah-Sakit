'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { Button } from 'primereact/button';
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
  const { id } = useParams();
  const toastRef = useRef(null);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const res = await axios.get(`${API_URL}/invoice/${id}`);
      setInvoice(res.data.data || null);
    } catch (err) {
      console.error('Gagal ambil invoice:', err);
      toastRef.current?.showToast('01', 'Gagal mengambil data invoice');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return `Rp ${Number(value || 0).toLocaleString('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
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

  const handleCetak = () => {
    window.open(`/invoice/cetak/${id}`, '_blank');
  };

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

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-3">
          <div className="bg-primary text-white p-4 text-center">
            <h1 className="text-2xl font-bold m-0">Detail Invoice</h1>
            <p className="m-1 opacity-90">No Invoice: #{invoice.NOINVOICE}</p>
          </div>

          <div className="p-4">
            <div className="grid">
              <div className="col-12 md:col-6">
                <h4>Informasi Pasien</h4>
                <Divider />
                <p><b>Nama:</b> {invoice.NAMAPASIEN}</p>
                <p><b>NIK:</b> {invoice.NIK}</p>
                <p><b>Asuransi:</b> {invoice.ASURANSI}</p>
              </div>

              <div className="col-12 md:col-6">
                <Divider />
                <h4>Rincian Biaya Riwayat</h4>
                <p><b>Biaya Kamar:</b> {formatCurrency(invoice.TOTALKAMAR)}</p>
                <p><b>Total Obat:</b> {formatCurrency(invoice.TOTALOBAT)}</p>
                <p><b>Total Tindakan:</b> {formatCurrency(invoice.TOTALTINDAKAN)}</p>
                <p><b>Total Biaya:</b> {formatCurrency(invoice.TOTALBIAYA)}</p>
                <Divider />
                <h4>Informasi Invoice</h4>
                <p><b>Tanggal Invoice:</b> {formatTanggal(invoice.TANGGALINVOICE)}</p>
                <p><b>Total Tagihan:</b> {formatCurrency(invoice.TOTALTAGIHAN)}</p>
                <p><b>Total Deposit:</b> {formatCurrency(invoice.TOTALDEPOSIT)}</p>
                <p><b>Total Angsuran:</b> {formatCurrency(invoice.TOTALANGSURAN)}</p>
                <p><b>Sisa Tagihan:</b> {formatCurrency(invoice.SISA_TAGIHAN)}</p>
                <p><b>Status:</b> <Tag value={statusLabels[invoice.STATUS] || invoice.STATUS} severity={statusSeverity[invoice.STATUS] || 'info'} /></p>
              </div>
            </div>

            {invoice.STATUS === 'LUNAS' && (
              <div className="text-center mt-4">
                <Button
                  icon="pi pi-print"
                  label="Cetak Invoice"
                  severity="success"
                  onClick={handleCetak}
                />
              </div>
            )}

            <Divider />
            <div className="text-center p-3 bg-gray-50 border-round">
              <p className="text-sm text-600 m-0">
                Terima kasih telah melakukan pembayaran
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}