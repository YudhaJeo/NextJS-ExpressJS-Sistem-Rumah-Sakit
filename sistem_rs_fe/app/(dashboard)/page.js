'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { LayoutContext } from '../../layout/context/layoutcontext';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Dashboard = () => {
  const { layoutConfig } = useContext(LayoutContext);
  const router = useRouter();
  const [data, setData] = useState(null);
  const [barData, setBarData] = useState({});
  const [barOptions, setBarOptions] = useState({});

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) return router.push('/login');

    axios.get(`${API_URL}/dashboard`)
      .then(res => {
        setData(res.data);
        setChartFromData(res.data.chart);
      })
      .catch(err => {
        console.error('Gagal ambil data dashboard:', err);
      });
  }, []);

  useEffect(() => {
    if (data?.chart) setChartFromData(data.chart);
  }, [layoutConfig.colorScheme]);

  const setChartFromData = (chart) => {
    setBarData(chart);

    const isLight = layoutConfig.colorScheme === 'light';
    setBarOptions({
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: isLight ? '#495057' : '#ebedef'
          },
          display: true
        }
      },
      scales: {
        x: {
          ticks: { color: isLight ? '#495057' : '#ebedef' },
          grid: { color: isLight ? '#ebedef' : 'rgba(160, 167, 181, .3)' }
        },
        y: {
          ticks: { color: isLight ? '#495057' : '#ebedef' },
          grid: { color: isLight ? '#ebedef' : 'rgba(160, 167, 181, .3)' },
          beginAtZero: true
        }
      }
    });
  };

  const cards = data?.cards ?? [];

  return (
    <div className="grid">
      <div className="col-12">
        <Card className="mb-3">
          <h1 className="text-2xl font-semibold text-900">Dashboard Utama</h1>
        </Card>
      </div>

      {cards.map((card, idx) => (
        <div className="col-12 lg:col-6 xl:col-3" key={idx}>
          <Card className="shadow-md" style={{ borderTop: `4px solid ${card.color}` }}>
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block text-500 font-medium mb-2">{card.title.toUpperCase()}</span>
                <div className="text-900 font-bold text-xl">{card.value}</div>
              </div>
              <div className="flex align-items-center justify-content-center border-round" style={{ width: '2.5rem', height: '2.5rem', backgroundColor: card.color + '20' }}>
                <i className={`${card.icon} text-2xl`} style={{ color: card.color }} />
              </div>
            </div>
          </Card>
        </div>
      ))}

      {data?.chart && (
        <div className="col-12">
          <Card>
            <div className="flex justify-content-between mb-3">
              <span className="font-medium text-lg text-900">Statistik Umum</span>
              <Tag value="Live" severity="info" />
            </div>
            <div className="h-20rem">
              <Chart type="bar" data={barData} options={barOptions} />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;