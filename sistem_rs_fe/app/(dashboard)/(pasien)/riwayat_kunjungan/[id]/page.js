'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import ToastNotifier from '@/app/components/toastNotifier';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const URL_API = process.env.NEXT_PUBLIC_URL;

export default function DetailRiwayatKunjunganPage() {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const toastRef = useRef(null);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      const res = await axios.get(`${API_URL}/riwayat_kunjungan`);
      const found = res.data.data.find(item => item.IDPENDAFTARAN == id);
      setDetail(found || null);
    } catch (err) {
      console.error('Gagal ambil detail:', err);
      toastRef.current?.showToast('01', 'Gagal mengambil detail kunjungan');
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
        <Message severity="warn" text="Data kunjungan tidak ditemukan." />
      </div>
    );
  }

  const fotoUrl = detail.FOTOPROFIL
    ? `${URL_API}/uploads/riwayat_pengobatan/${detail.FOTOPROFIL}`
    : null;

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />

      <div className="max-w-4xl mx-auto">
        <Card className="shadow-3">
          <div className="bg-primary text-white p-4 text-center">
            <h1 className="text-2xl font-bold m-0">Detail Riwayat Kunjungan</h1>
            <p className="m-1 opacity-90">ID Pendaftaran: #{detail.IDPENDAFTARAN}</p>
          </div>

          <div className="p-4">
            <div className="grid">
              <div className="col-12 md:col-6">
                <h4>Informasi Pasien</h4>
                <Divider />
                <p><b>Nama Lengkap:</b> {detail.NAMALENGKAP}</p>
                <p><b>NIK:</b> {detail.NIK}</p>
                {fotoUrl && <img src={fotoUrl} alt="Foto Pasien" className="mt-2 rounded-md w-40" />}
              </div>

              <div className="col-12 md:col-6">
                <h4>Informasi Kunjungan</h4>
                <Divider />
                <p><b>Tanggal Kunjungan:</b> {formatTanggal(detail.TANGGALKUNJUNGAN)}</p>
                <p><b>Poli:</b> {detail.POLI}</p>
                <p><b>Status Kunjungan:</b> <Tag value={detail.STATUSKUNJUNGAN} severity={detail.STATUSKUNJUNGAN === 'Selesai' ? 'success' : 'warning'} /></p>
                <p><b>Status Rawat:</b> {detail.STATUSRAWAT || '-'}</p>
                <p><b>Dokter:</b> {detail.NAMADOKTER || '-'}</p>
              </div>
            </div>

            <Divider />

            <h4>Keluhan</h4>
            <p>{detail.KELUHAN || '-'}</p>

            <Divider />

            <h4>Diagnosa & Obat</h4>
            <p><b>Diagnosa:</b> {detail.DIAGNOSA || '-'}</p>
            <p><b>Obat:</b> {detail.OBAT || '-'}</p>

            <Divider />
            <div className="text-center mt-4 p-3 bg-gray-50 border-round">
              <p className="text-sm text-600 m-0">
                Terima kasih atas kunjungan Anda
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}