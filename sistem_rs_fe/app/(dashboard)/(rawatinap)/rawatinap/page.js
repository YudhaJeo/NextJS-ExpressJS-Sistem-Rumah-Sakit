// app/(dashboard)/(rawatinap)/rawatinap/page.js
'use client';

import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const DashboardRawatInap = () => {
  const [data, setData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) return router.push('/login');

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/rawatinap`)
      .then((res) => setData(res.data.data))
      .catch((err) => console.error('Gagal ambil data dashboard:', err));
  }, []);

  const cards = [
    {
      title: 'Bed Tersedia',
      value: data?.tersedia ?? 0,
      icon: 'pi pi-objects-column',
      color: 'bg-blue-100',
      border: '#28a745',
    },
    {
      title: 'Bed Terisi',
      value: data?.terisi ?? 0,
      icon: 'pi pi-users',
      color: 'bg-green-100',
      border: '#007bff',
    },
    {
      title: 'Jumlah Kamar',
      value: data?.jumlah_kamar ?? 0,
      icon: 'pi pi-box',
      color: 'bg-cyan-100',
      border: '#17a2b8',
    },
    {
      title: 'Jumlah Bangsal',
      value: data?.jumlah_bangsal ?? 0,
      icon: 'pi pi-table',
      color: 'bg-pink-100',
      border: '#e83e8c',
    },
  ];

  return (
    <div className="grid">
    
    <div className='card col-12'>
        <h1 className="text-xl font-semibold mb-3">Dashboard Monitoring Rawat Inap</h1>
    </div>
    
    {/* Top data  */}
      {cards.map((card, i) => (
        <div className="col-12 md:col-6 xl:col-3" key={i}>
          <Card
            className="shadow-md mb-4"
            style={{ borderTop: `4px solid ${card.border}` }}
          >
            <div className="flex justify-content-between">
              <div>
                <span className="block text-500 mb-2">{card.title}</span>
                <span className="text-900 font-bold text-xl md:text-2xl">
                  {card.value}
                </span>
              </div>
              <div
                className={`flex align-items-center justify-content-center ${card.color} border-round`}
                style={{ width: '2.5rem', height: '2.5rem' }}
              >
                <i className={`${card.icon} text-xl`} />
              </div>
            </div>
          </Card>
        </div>
      ))}

    </div>
  );
};

export default DashboardRawatInap;
