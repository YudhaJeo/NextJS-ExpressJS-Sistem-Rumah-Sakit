// app/(dashboard)/(rawat_inap)/rawat_inap/page.js
'use client';

import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Tag } from 'primereact/tag';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const DashboardRawatInap = () => {
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
      .get(`${process.env.NEXT_PUBLIC_API_URL}/rawat_inap`)
      .then((res) => {
        const data = res.data.data;
        setData(data);

        const style = getComputedStyle(document.documentElement);

        // Bar Chart
        setBarChartData({
          labels: ['Tersedia', 'Terisi', 'Jumlah Kamar', 'Jumlah Bangsal'],
          datasets: [
            {
              label: 'Statistik Rawat Inap',
              data: [
                data.tersedia,
                data.terisi,
                data.jumlah_kamar,
                data.jumlah_bangsal,
              ],
              backgroundColor: [
                'rgba(255, 159, 64, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)'
              ],
              borderColor: [
                'rgb(255, 159, 64)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)'
              ],
              borderWidth: 1
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
              grid: { color: style.getPropertyValue('--surface-border') },
              ticks: { color: style.getPropertyValue('--text-color') },
            },
            y: {
              ticks: { color: style.getPropertyValue('--text-color') },
            },
          },
        });

        // Polar Area Chart
        setPolarChartData({
          labels: ['Tersedia', 'Terisi', 'Jumlah Kamar', 'Jumlah Bangsal'],
          datasets: [
            {
              data: [
                data.tersedia,
                data.terisi,
                data.jumlah_kamar,
                data.jumlah_bangsal,
              ],
              backgroundColor: [
                'rgba(255, 159, 64, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)'
              ],
              borderColor: [
                'rgb(255, 159, 64)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)'
              ],
              borderWidth: 1
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
      .catch((err) => console.error('Gagal ambil data dashboard:', err));
  }, []);

  const cards = [
    {
      title: 'Bed Tersedia',
      value: data?.tersedia ?? 0,
      icon: 'pi pi-objects-column',
      background: 'rgba(255, 159, 64, 0.2)',
      border: 'rgb(255, 159, 64)',
    },
    {
      title: 'Bed Terisi',
      value: data?.terisi ?? 0,
      icon: 'pi pi-users',
      background: 'rgba(75, 192, 192, 0.2)',
      border: 'rgb(75, 192, 192)',
    },
    {
      title: 'Jumlah Kamar',
      value: data?.jumlah_kamar ?? 0,
      icon: 'pi pi-box',
      background: 'rgba(54, 162, 235, 0.2)',
      border: 'rgb(54, 162, 235)',
    },
    {
      title: 'Jumlah Bangsal',
      value: data?.jumlah_bangsal ?? 0,
      icon: 'pi pi-table',
      background: 'rgba(153, 102, 255, 0.2)',
      border: 'rgb(153, 102, 255)',
    },
  ];

  return (
    <div className="grid">
      <div className="card col-12">
        <h1 className="text-xl font-semibold mb-3">
          Dashboard Monitoring Rawat Inap
        </h1>
      </div>

      {/* Card */}
      {cards.map((card, i) => (
        <div className="col-12 md:col-6 xl:col-3" key={i}>
          <Card
            className="shadow-md"
            style={{ borderTop: `4px solid ${card.border}` }}
          >
            <div className="flex justify-content-between">
              <div>
                <span className="block text-500 mb-2">{card.title}</span>
                <span className="text-900 font-bold text-xl md:text-2xl">
                  {card.value}
                </span>
              </div>
              <div>
                <div
                  className={`flex align-items-center justify-content-center ${card.color} border-round`}
                  style={{ width: '2.5rem', height: '2.5rem' }}
                >
                  <i className={`${card.icon} text-xl`} />
                </div>
                <Tag value="Live" severity="info" />
              </div>
            </div>
          </Card>
        </div>
      ))}

      {/* Polar Area Chart */}
      <div className="col-12 md:col-6">
        <Card>
          <div className="flex justify-content-between mb-3">
            <span className="font-medium text-lg text-900">
              Perbandingan Data Rawat Inap
            </span>
            <Tag value="Live" severity="info" />
          </div>
          <Chart
            type="polarArea"
            data={polarChartData}
            options={polarChartOptions}
            className="w-full"
          />
        </Card>
      </div>

      {/* Bar Chart */}
      <div className="col-12 md:col-6">
        <Card>
          <div className="flex justify-content-between mb-3">
            <span className="font-medium text-lg text-900">
              Statistik Rawat Inap
            </span>
            <Tag value="Live" severity="info" />
          </div>
          <Chart
            type="bar"
            data={barChartData}
            options={barChartOptions}
            className="w-full"
          />
        </Card>
      </div>
    </div>
  );
};

export default DashboardRawatInap;
