'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
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

  const formatCurrency = (value) =>
    `Rp ${Number(value || 0).toLocaleString('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;

  const formatTanggal = (tanggal) => {
    if (!tanggal) return '-';
    return new Date(tanggal).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

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

  // hitungan invoice
  const totalKamar = num(invoice.TOTALKAMAR);
  const totalObat = num(invoice.TOTALOBAT);
  const totalAlkes = num(invoice.TOTALALKES);
  const totalTindakan = num(invoice.TOTALTINDAKAN);
  const totalBiaya = num(invoice.TOTALBIAYA) || totalKamar + totalObat + totalTindakan;

  const totalTagihan = num(invoice.TOTALTAGIHAN) || totalBiaya;
  const totalDeposit = num(invoice.TOTALDEPOSIT);
  const totalAngsuran = num(invoice.TOTALANGSURAN);
  const sisaTagihan = num(invoice.SISA_TAGIHAN) || (totalTagihan - totalDeposit - totalAngsuran);

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <div className="max-w-4xl mx-auto space-y-4">

        {/* ---------- RAWAT JALAN ---------- */}
        {invoice.IDRIWAYATJALAN && (
          <Card className="shadow-2">
            <div className="bg-blue-600 text-white p-3 text-center border-round-top">
              <h2 className="m-0">Detail Rawat Jalan</h2>
            </div>
            <div className="p-4">
              <p><b>Nama Pasien:</b> {invoice.NAMAPASIEN}</p>
              <p><b>Tanggal Rawat:</b> {formatTanggal(invoice.TANGGALRAWATJALAN)}</p>
              <Divider />
              <h4>Ringkasan Biaya</h4>
              <p><b>Total Tindakan Jalan:</b>{' '}{formatCurrency(invoice.tindakanJalan?.reduce((sum, t) => sum + (t.TOTAL || 0), 0))}</p>
              <p><b>Total Biaya Rawat Jalan:</b> {formatCurrency(invoice.TOTALBIAYAJALAN)}</p>
            </div>
          </Card>
        )}

        {/* ---------- RAWAT INAP ---------- */}
        {invoice.IDRIWAYATINAP && (
          <Card className="shadow-2">
            <div className="bg-green-600 text-white p-3 text-center border-round-top">
              <h2 className="m-0">Detail Rawat Inap</h2>
            </div>
            <div className="p-4">
              <p><b>Nama Pasien:</b> {invoice.NAMAPASIEN}</p>
              <p><b>Nomor Bed:</b> {invoice.NOMORBED ?? '-'}</p>
              <p><b>Tanggal Masuk:</b> {formatTanggal(invoice.TANGGALMASUK)}</p>
              <p><b>Tanggal Keluar:</b> {formatTanggal(invoice.TANGGALKELUAR)}</p>
              <Divider />
              <h4>Ringkasan Biaya</h4>
              <p><b>Biaya Kamar:</b> {formatCurrency(totalKamar)}</p>
              <p><b>Total Obat:</b> {formatCurrency(totalObat)}</p>
              <p><b>Total Alkes:</b> {formatCurrency(totalAlkes)}</p>
              <p><b>Total Tindakan:</b> {formatCurrency(totalTindakan)}</p>
              <p><b>Total Biaya Rawat Inap:</b> {formatCurrency(totalBiaya)}</p>
            </div>
          </Card>
        )}

        {/* ---------- INVOICE ---------- */}
        {invoice.NOINVOICE && (
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
                  <h4>Informasi Invoice</h4>
                  <p><b>Tanggal Invoice:</b> {formatTanggal(invoice.TANGGALINVOICE)}</p>
                  <p><b>Total Tagihan:</b> {formatCurrency(totalTagihan)}</p>
                  <p><b>Total Deposit:</b> {formatCurrency(totalDeposit)}</p>
                  <p><b>Total Angsuran:</b> {formatCurrency(totalAngsuran)}</p>
                  <p><b>Sisa Tagihan:</b> {formatCurrency(sisaTagihan)}</p>
                  <p><b>Status:</b> <Tag value={statusLabels[invoice.STATUS] || invoice.STATUS} severity={statusSeverity[invoice.STATUS] || 'info'} /></p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}