'use client';

import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Tag } from 'primereact/tag';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const DashboardDokter = () => {
  const [data, setData] = useState(null);
  const [barChartData, setBarChartData] = useState({});
  const [barChartOptions, setBarChartOptions] = useState({});
  const [polarChartData, setPolarChartData] = useState({});
  const [polarChartOptions, setPolarChartOptions] = useState({});
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) return router.push('/login');

    axios
      .get(`${API_URL}/dashboard_dokter`)
      .then((res) => {
        const resData = res.data;
        console.log('DATA DASHBOARD:', resData);
        setData(resData);

        const style = getComputedStyle(document.documentElement);

        const labels = ['Jumlah Dokter', 'Jumlah Poli', 'Jadwal Hari Ini', 'Laporan Hari Ini'];
        const values = [
          resData.totalDokter ?? 0,
          resData.totalPoli ?? 0,
          resData.jadwalHariIni ?? 0,
          resData.laporanHariIni ?? 0, // default ke 0 jika belum ada
        ];

        const backgroundColors = [
          'rgba(179, 59, 255, 0.2)',
          'rgba(255, 204, 0, 0.2)',
          'rgba(6, 146, 62, 0.2)',
          'rgba(138, 0, 0, 0.2)',
        ];

        const borderColors = [
          '#B13BFF',
          '#FFCC00',
          '#06923E',
          '#8A0000',
        ];

        setBarChartData({
          labels,
          datasets: [
            {
              label: 'Statistik Dokter',
              data: values,
              backgroundColor: backgroundColors,
              borderColor: borderColors,
              borderWidth: 1,
            },
          ],
        });

        setBarChartOptions({
          indexAxis: 'y',
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: { color: style.getPropertyValue('--text-color') },
              grid: { color: style.getPropertyValue('--surface-border') },
            },
            y: {
              ticks: { color: style.getPropertyValue('--text-color') },
            },
          },
        });

        setPolarChartData({
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: backgroundColors,
              borderColor: borderColors,
              borderWidth: 1,
            },
          ],
        });

        setPolarChartOptions({
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: style.getPropertyValue('--text-color') },
            },
          },
        });
      })
      .catch((err) => {
        console.error('Gagal ambil data dashboard dokter:', err);
        setData(null); // fallback ke null
      });
  }, []);

  const cards = [
    {
      title: 'Jumlah Dokter',
      value: data?.totalDokter ?? 0,
      icon: 'pi pi-user-plus',
      background: 'rgba(179, 59, 255, 0.2)',
      border: '#B13BFF',
    },
    {
      title: 'Jumlah Poli',
      value: data?.totalPoli ?? 0,
      icon: 'pi pi-briefcase',
      background: 'rgba(255, 204, 0, 0.2)',
      border: '#FFCC00',
    },
    {
      title: 'Jadwal Hari Ini',
      value: data?.jadwalHariIni ?? 0,
      icon: 'pi pi-calendar',
      background: 'rgba(6, 146, 62, 0.2)',
      border: '#06923E',
    },
    {
      title: 'Laporan Hari Ini',
      value: data?.laporanHariIni ?? 0,
      icon: 'pi pi-book',
      background: 'rgba(138, 0, 0, 0.2)',
      border: '#8A0000',
    },
  ];

  return (
    <div className="grid">
      <div className="card col-12">
        <h1 className="text-xl font-semibold mb-3">Dashboard Dokter</h1>
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
            <span className="font-medium text-lg text-900">Perbandingan Data Dokter</span>
            <Tag value="Live" severity="info" />
          </div>
          <Chart type="polarArea" data={polarChartData} options={polarChartOptions} className="w-full" />
        </Card>
      </div>

      <div className="col-12 md:col-6">
        <Card>
          <div className="flex justify-content-between mb-3">
            <span className="font-medium text-lg text-900">Statistik Dokter</span>
            <Tag value="Live" severity="info" />
          </div>
          <Chart type="bar" data={barChartData} options={barChartOptions} className="w-full" />
        </Card>
      </div>
    </div>
  );
};

export default DashboardDokter;