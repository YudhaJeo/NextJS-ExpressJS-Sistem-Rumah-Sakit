'use client';

import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Tag } from 'primereact/tag';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const TabRanap = () => {
  const [summary, setSummary] = useState({
    aktif: 0,
    selesai: 0,
    tagihan: 0,
    laporan: 0,
  });

  const [barChartData, setBarChartData] = useState({});
  const [barChartOptions, setBarChartOptions] = useState({});
  const [polarChartData, setPolarChartData] = useState({});
  const [polarChartOptions, setPolarChartOptions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/dashboard_rawat_inap/rawatinap`);
        const data = res.data.data;

        setSummary({
          aktif: data.aktif,
          selesai: data.selesai,
          tagihan: data.tagihan,
          laporan: data.laporan,
        });

        const style = getComputedStyle(document.documentElement);

        // bar chart
        setBarChartData({
          labels: ['Aktif', 'Selesai', 'Tagihan', 'Laporan'],
          datasets: [
            {
              label: 'Statistik Rawat Inap',
              data: [data.aktif, data.selesai, data.tagihan, data.laporan],
              backgroundColor: [
                'rgba(255, 159, 64, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
              ],
              borderColor: [
                'rgb(255, 159, 64)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
              ],
              borderWidth: 1,
            },
          ],
        });

        setBarChartOptions({
          indexAxis: 'y',
          plugins: { legend: { display: false } },
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

        // polar chart
        setPolarChartData({
          labels: ['Aktif', 'Selesai', 'Tagihan', 'Laporan'],
          datasets: [
            {
              data: [data.aktif, data.selesai, data.tagihan, data.laporan],
              backgroundColor: [
                'rgba(255, 159, 64, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
              ],
              borderColor: [
                'rgb(255, 159, 64)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
              ],
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
      } catch (err) {
        console.error('Gagal ambil data dashboard:', err);
      }
    };

    fetchData();
  }, []);

  const cards = [
    {
      title: 'Rawat Inap Aktif',
      value: summary.aktif,
      icon: 'pi pi-check-circle',
      border: 'rgb(255, 159, 64)',
    },
    {
      title: 'Rawat Inap Selesai',
      value: summary.selesai,
      icon: 'pi pi-times-circle',
      border: 'rgb(75, 192, 192)',
    },
    {
      title: 'Tagihan Sementara',
      value: summary.tagihan,
      icon: 'pi pi-credit-card',
      border: 'rgb(54, 162, 235)',
    },
    {
      title: 'Laporan Riwayat',
      value: summary.laporan,
      icon: 'pi pi-file',
      border: 'rgb(153, 102, 255)',
    },
  ];

  return (
    <div className="grid">
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

      <div className="col-12 md:col-6">
        <Card>
          <div className="flex justify-content-between mb-3">
            <span className="font-medium text-lg text-900">Perbandingan Data Rawat Inap</span>
            <Tag value="Live" severity="info" />
          </div>
          <Chart type="polarArea" data={polarChartData} options={polarChartOptions} className="w-full" />
        </Card>
      </div>

      <div className="col-12 md:col-6">
        <Card>
          <div className="flex justify-content-between mb-3">
            <span className="font-medium text-lg text-900">Statistik Rawat Inap</span>
            <Tag value="Live" severity="info" />
          </div>
          <Chart type="line" data={barChartData} options={barChartOptions} className="w-full" />
          <Chart type="bar" data={barChartData} options={barChartOptions} className="w-full" />
        </Card>
      </div>
    </div>
  );
};

export default TabRanap;
