'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import ToastNotifier from '@/app/components/toastNotifier';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DetailRiwayatInapPage() {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
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
    } catch (err) {
      console.error('Gagal ambil detail:', err);
      toastRef.current?.showToast('01', 'Gagal mengambil detail rawat inap');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <p className="text-gray-500">Tidak ada data ditemukan.</p>
        </div>
      </div>
    );
  }

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

  const hitungSubTotal = () => {
    const totalObat = detail.OBAT?.reduce((sum, obat) => sum + (obat.HARGA || 0), 0) || 0;
    const totalTindakan = detail.TINDAKAN?.reduce((sum, tindakan) => sum + (tindakan.TARIF || 0), 0) || 0;
    return totalObat + totalTindakan;
  };

  const subTotal = hitungSubTotal();
  const totalKamar = detail.TOTAL_HARGA_KAMAR || 0;
  const grandTotal = subTotal + totalKamar;

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      
      <div className="">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          
          {/* Invoice Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8">
            <div className="flex justify-between">
              <div className="text-white">
                <h1 className="text-2xl font-bold">Detail Rawat Inap</h1>
                <p className="text-blue-100">ID Transaksi: ID{id}</p>
              </div>
            </div>
          </div>

          {/* Patient Info */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Informasi Pasien
                </h3>
                <div className="mt-3">
                  <p className="text-lg font-semibold text-gray-900">{detail.NAMALENGKAP}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Periode Rawat Inap
                </h3>
                <div className="mt-3 space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Masuk:</span> {formatTanggal(detail.TANGGALMASUK)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Keluar:</span> {formatTanggal(detail.TANGGALKELUAR)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Services Table */}
          <div className="px-8 py-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rincian Layanan</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Layanan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jenis
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Biaya
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Kamar */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Biaya Kamar Rawat Inap
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Kamar
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                      {formatRupiah(totalKamar)}
                    </td>
                  </tr>

                  {/* Obat */}
                  {detail.OBAT?.map((obat, index) => (
                    <tr key={`obat-${index}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 2}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {obat.NAMAOBAT}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Obat
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                        {formatRupiah(obat.HARGA)}
                      </td>
                    </tr>
                  ))}

                  {/* Tindakan */}
                  {detail.TINDAKAN?.map((tindakan, index) => (
                    <tr key={`tindakan-${index}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(detail.OBAT?.length || 0) + index + 2}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {tindakan.NAMATINDAKAN}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          Tindakan
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                        {formatRupiah(tindakan.TARIF)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total Section */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-end">
              <div className="w-full max-w-sm">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sub Total Layanan:</span>
                    <span className="font-medium">{formatRupiah(subTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Biaya Kamar:</span>
                    <span className="font-medium">{formatRupiah(totalKamar)}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-blue-600">{formatRupiah(grandTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-white border-t border-gray-200">
            <div className="text-center text-sm text-gray-500">
              <p>Terima kasih atas kepercayaan Anda menggunakan layanan kami</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}