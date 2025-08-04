'use client';

import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Tag } from 'primereact/tag';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const DashboardPasien = () => {
  const [data, setData] = useState(null);
  const [barChartData, setBarChartData] = useState({});
  const [barChartOptions, setBarChartOptions] = useState({});
  const [polarChartData, setPolarChartData] = useState({});
  const [polarChartOptions, setPolarChartOptions] = useState({});
  const router = useRouter();

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/statistik-pasien`)
      .then((res) => {
        const result = res.data;
        setData(result);

        const style = getComputedStyle(document.documentElement);

        const labels = ['Total Pasien', 'Pasien Hari Ini', 'Laki-laki', 'Perempuan'];
        const values = [
          result.totalPasien,
          result.pasienHariIni,
          result.jumlahLaki,
          result.jumlahPerempuan,
        ];
        const backgroundColors = [
          'rgba(0, 123, 255, 0.2)',
          'rgba(40, 167, 69, 0.2)',
          'rgba(23, 162, 184, 0.2)',
          'rgba(232, 62, 140, 0.2)',
        ];
        const borderColors = [
          '#007bff',
          '#28a745',
          '#17a2b8',
          '#e83e8c',
        ];

        setBarChartData({
          labels,
          datasets: [
            {
              label: 'Statistik Pasien',
              data: values,
              backgroundColor: backgroundColors,
              borderColor: borderColors,
              borderWidth: 1,
            },
          ],
        });

        setBarChartOptions({
          indexAxis: 'y',
          plugins: { legend: { display: false } },
          scales: {
            x: {
              min: 0, 
              ticks: {
                stepSize: 1,
                color: style.getPropertyValue('--text-color'),
              },
              grid: {
                color: style.getPropertyValue('--surface-border'),
              },
            },
            y: {
              ticks: {
                color: style.getPropertyValue('--text-color'),
              },
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
          scales: {
            r: {
              beginAtZero: false,
              min: 0, 
              ticks: {
                stepSize: 1,
                color: style.getPropertyValue('--text-color'),
              },
              grid: {
                color: style.getPropertyValue('--surface-border'),
              },
            },
          },
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: style.getPropertyValue('--text-color') },
            },
          },
        });
      })
      .catch((err) => console.error('Gagal ambil data dashboard pasien:', err));
  }, []);

  const cards = [
    {
      title: 'Total Pasien',
      value: data?.totalPasien ?? 0,
      icon: 'pi pi-users',
      background: 'rgba(0, 123, 255, 0.2)',
      border: '#007bff',
    },
    {
      title: 'Pasien Hari Ini',
      value: data?.pasienHariIni ?? 0,
      icon: 'pi pi-calendar-plus',
      background: 'rgba(40, 167, 69, 0.2)',
      border: '#28a745',
    },
    {
      title: 'Laki-laki',
      value: data?.jumlahLaki ?? 0,
      icon: 'pi pi-mars',
      background: 'rgba(23, 162, 184, 0.2)',
      border: '#17a2b8',
    },
    {
      title: 'Perempuan',
      value: data?.jumlahPerempuan ?? 0,
      icon: 'pi pi-venus',
      background: 'rgba(232, 62, 140, 0.2)',
      border: '#e83e8c',
    },
  ];

  return (
    <div className="grid">
      <div className="card col-12">
        <h1 className="text-xl font-semibold mb-3">Dashboard Monitoring Pasien</h1>
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
            <span className="font-medium text-lg text-900">Perbandingan Data Pasien</span>
            <Tag value="Live" severity="info" />
          </div>
          <Chart type="polarArea" data={polarChartData} options={polarChartOptions} className="w-full" />
        </Card>
      </div>

      <div className="col-12 md:col-6">
        <Card>
          <div className="flex justify-content-between mb-3">
            <span className="font-medium text-lg text-900">Statistik Pasien</span>
            <Tag value="Live" severity="info" />
          </div>
          <Chart type="bar" data={barChartData} options={barChartOptions} className="w-full" />
        </Card>
      </div>
    </div>
  );
};

export default DashboardPasien;