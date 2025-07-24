'use client';

import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Tag } from 'primereact/tag';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const DashboardKasir = () => {
  const [data, setData] = useState(null);
  const [invoiceChart, setInvoiceChart] = useState({});
  const [depositChart, setDepositChart] = useState({});
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) return router.push('/login');

    axios
      .get(`${API_URL}/dashboard_kasir`)
      .then((res) => {
        const resData = res.data;
        console.log('DATA DASHBOARD KASIR:', resData);
        setData(resData);

        const lunas = resData.statusInvoice?.LUNAS ?? 0;
        const belum = resData.statusInvoice?.BELUM_LUNAS ?? 0;

        setInvoiceChart({
          labels: ['LUNAS', 'BELUM LUNAS'],
          datasets: [
            {
              data: [lunas, belum],
              backgroundColor: ['#28A745', '#DC3545'],
            },
          ],
        });

        const aktif = resData.statusDeposit?.AKTIF ?? 0;
        const habis = resData.statusDeposit?.HABIS ?? 0;
        const refund = resData.statusDeposit?.REFUND ?? 0;

        setDepositChart({
          labels: ['AKTIF', 'HABIS', 'REFUND'],
          datasets: [
            {
              data: [aktif, habis, refund],
              backgroundColor: ['#007BFF', '#FFC107', '#6C757D'],
            },
          ],
        });
      })
      .catch((err) => {
        console.error('Gagal ambil data dashboard kasir:', err);
        setData(null);
      });
  }, []);

  const cards = [
    {
      title: 'Total Invoice',
      value: data?.totalInvoice ?? 0,
      icon: 'pi pi-file',
      background: 'rgba(0, 123, 255, 0.2)',
      border: '#007BFF',
    },
    {
      title: 'Total Pembayaran',
      value: data?.totalPembayaran ?? 0,
      icon: 'pi pi-wallet',
      background: 'rgba(40, 167, 69, 0.2)',
      border: '#28A745',
    },
    {
      title: 'Total Deposit',
      value: data?.totalDeposit ?? 0,
      icon: 'pi pi-dollar',
      background: 'rgba(255, 193, 7, 0.2)',
      border: '#FFC107',
    },
    {
      title: 'Penggunaan Deposit',
      value: data?.totalDepositPenggunaan ?? 0,
      icon: 'pi pi-list',
      background: 'rgba(23, 162, 184, 0.2)',
      border: '#17A2B8',
    },
  ];

  return (
    <div className="grid">
      <div className="card col-12">
        <h1 className="text-xl font-semibold mb-3">Dashboard Kasir</h1>
      </div>

      {cards.map((card, i) => (
        <div className="col-12 md:col-6 xl:col-3" key={i}>
          <Card className="shadow-md" style={{ borderTop: `4px solid ${card.border}` }}>
            <div className="flex justify-content-between">
              <div>
                <span className="block text-500 mb-2">{card.title}</span>
                <span className="text-900 font-bold text-xl md:text-2xl">{card.value}</span>
              </div>
              <div>
                <div
                  className="flex align-items-center justify-content-center border-round"
                  style={{
                    background: card.background,
                    width: '2.5rem',
                    height: '2.5rem',
                  }}
                >
                  <i className={`${card.icon} text-xl`} />
                </div>
                <Tag value="Live" severity="info" />
              </div>
            </div>
          </Card>
        </div>
      ))}

      <div className="col-12 md:col-6">
        <Card>
          <div className="flex justify-content-between mb-3">
            <span className="font-medium text-lg text-900">Status Invoice</span>
            <Tag value="Live" severity="info" />
          </div>
          <Chart type="pie" data={invoiceChart} className="w-full" />
        </Card>
      </div>

      <div className="col-12 md:col-6">
        <Card>
          <div className="flex justify-content-between mb-3">
            <span className="font-medium text-lg text-900">Status Deposit</span>
            <Tag value="Live" severity="info" />
          </div>
          <Chart type="pie" data={depositChart} className="w-full" />
        </Card>
      </div>
    </div>
  );
};

export default DashboardKasir;