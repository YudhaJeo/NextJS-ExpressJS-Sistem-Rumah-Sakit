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
  const [lineData, setLineData] = useState({});
  const [lineOptions, setLineOptions] = useState({});

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) return router.push('/login');

    axios.get(`${API_URL}/dashboard`)
      .then(res => {
        setData(res.data);
        buildCharts(res.data);
      })
      .catch(err => {
        console.error('Gagal ambil data dashboard:', err);
      });
  }, []);

  useEffect(() => {
    if (layoutConfig.colorScheme === 'light') applyLightTheme();
    else applyDarkTheme();
  }, [layoutConfig.colorScheme]);

  const buildCharts = (res) => {
    setBarData({
      labels: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
      datasets: [{
        label: "Pengunjung",
        backgroundColor: "#0D5EA6",
        data: res.statistikHarian ?? []
      }]
    });

    setLineData({
      labels: res.statistikBulanan?.labels ?? [],
      datasets: [
        {
          label: "Revenue",
          data: res.statistikBulanan?.revenue ?? [],
          borderColor: "#42A5F5",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Profit",
          data: res.statistikBulanan?.profit ?? [],
          borderColor: "#66BB6A",
          fill: true,
          tension: 0.4,
        }
      ]
    });
  };

  const applyLightTheme = () => {
    const common = {
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#495057' } } },
      scales: {
        x: { ticks: { color: '#495057' }, grid: { color: '#ebedef' } },
        y: { ticks: { color: '#495057' }, grid: { color: '#ebedef' }, beginAtZero: true }
      }
    };
    setBarOptions({ ...common, plugins: { legend: { display: false } } });
    setLineOptions(common);
  };

  const applyDarkTheme = () => {
    const common = {
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#ebedef' } } },
      scales: {
        x: { ticks: { color: '#ebedef' }, grid: { color: 'rgba(160, 167, 181, .3)' } },
        y: { ticks: { color: '#ebedef' }, grid: { color: 'rgba(160, 167, 181, .3)' }, beginAtZero: true }
      }
    };
    setBarOptions({ ...common, plugins: { legend: { display: false } } });
    setLineOptions(common);
  };

  const cards = [
    {
      title: "JUMLAH PASIEN",
      value: data?.jumlahPasien ?? 0,
      icon: "pi pi-users",
      bgColor: "bg-blue-100",
      borderColor: "#0D5EA6",
    },
    {
      title: "JUMLAH DOKTER",
      value: data?.jumlahDokter ?? 0,
      icon: "pi pi-user-md",
      bgColor: "bg-green-100",
      borderColor: "#28a745",
    },
    {
      title: "BED TERSEDIA",
      value: data?.bedTersedia ?? 0,
      icon: "pi pi-check-circle",
      bgColor: "bg-yellow-100",
      borderColor: "#ffc107",
    },
    {
      title: "BED TERISI",
      value: data?.bedTerisi ?? 0,
      icon: "pi pi-times-circle",
      bgColor: "bg-red-100",
      borderColor: "#dc3545",
    }
  ];

  return (
    <div className="grid">
      <div className="col-12">
        <Card className="mb-3">
          <h1 className="text-2xl font-semibold text-900">Dashboard Utama</h1>
        </Card>
      </div>

      {cards.map((card, idx) => (
        <div className="col-12 lg:col-6 xl:col-3" key={idx}>
          <Card className="shadow-md" style={{ borderTop: `4px solid ${card.borderColor}` }}>
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block text-500 font-medium mb-2">{card.title}</span>
                <div className="text-900 font-bold text-xl">{card.value}</div>
              </div>
              <div className={`flex align-items-center justify-content-center ${card.bgColor} border-round`} style={{ width: '2.5rem', height: '2.5rem' }}>
                <i className={`${card.icon} text-2xl`} />
              </div>
            </div>
          </Card>
        </div>
      ))}

      <div className="col-12 md:col-6">
        <Card>
          <div className="flex justify-content-between mb-3">
            <span className="font-medium text-lg text-900">Statistik Mingguan</span>
            <Tag value="Live" severity="info" />
          </div>
          <div className="h-10rem">
            <Chart type="bar" data={barData} options={barOptions} />
          </div>
        </Card>
      </div>

      <div className="col-12 md:col-6">
        <Card>
          <div className="flex justify-content-between mb-3">
            <span className="font-medium text-lg text-900">Statistik Bulanan</span>
          </div>
          <div className="h-10rem">
            <Chart type="line" data={lineData} options={lineOptions} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;