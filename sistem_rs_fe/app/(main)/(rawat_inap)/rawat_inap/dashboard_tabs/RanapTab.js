// D:\MARSTECH\NextJS-ExpressJS-Final-System\sistem_rs_fe\app\(main)\(rawat_inap)\rawat_inap\dashboard_tabs\RanapTab.js
'use client';

import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Tag } from 'primereact/tag';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const TabRanap = () => {
  const [summary, setSummary] = useState({
    tersedia: 0,
    terisi: 0,
    jumlah_kamar: 0,
    jumlah_bangsal: 0,
  });

  const [barChartData, setBarChartData] = useState({});
  const [barChartOptions, setBarChartOptions] = useState({});
  const [polarChartData, setPolarChartData] = useState({});
  const [polarChartOptions, setPolarChartOptions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/bed`);
        const beds = res.data.data;

        const tersedia = beds.filter((b) => b.STATUSBED === 'TERSEDIA').length;
        const total = beds.length;
        const terisi = total - tersedia;
        const kamar = new Set(beds.map((b) => b.NAMAKAMAR)).size;
        const bangsal = new Set(beds.map((b) => b.NAMABANGSAL)).size;

        const newSummary = {
          tersedia,
          terisi,
          jumlah_kamar: kamar,
          jumlah_bangsal: bangsal,
        };
        setSummary(newSummary);

        const style = getComputedStyle(document.documentElement);

        // bar chart
        setBarChartData({
          labels: ['Tersedia', 'Terisi', 'Jumlah Kamar', 'Jumlah Bangsal'],
          datasets: [
            {
              label: 'Statistik Rawat Inap',
              data: [tersedia, terisi, kamar, bangsal],
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
          labels: ['Tersedia', 'Terisi', 'Jumlah Kamar', 'Jumlah Bangsal'],
          datasets: [
            {
              data: [tersedia, terisi, kamar, bangsal],
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
      title: 'Bed Tersedia',
      value: summary.tersedia,
      icon: 'pi pi-objects-column',
      border: 'rgb(255, 159, 64)',
    },
    {
      title: 'Bed Terisi',
      value: summary.terisi,
      icon: 'pi pi-users',
      border: 'rgb(75, 192, 192)',
    },
    {
      title: 'Jumlah Kamar',
      value: summary.jumlah_kamar,
      icon: 'pi pi-box',
      border: 'rgb(54, 162, 235)',
    },
    {
      title: 'Jumlah Bangsal',
      value: summary.jumlah_bangsal,
      icon: 'pi pi-table',
      border: 'rgb(153, 102, 255)',
    },
  ];

  return (
    <div className="grid">
      <div className="card col-12">
        <h1 className="text-xl font-semibold mb-3">Dashboard Monitoring Rawat Inap</h1>
      </div>

      {cards.map((card, i) => (
        <div className="col-12 md:col-6 xl:col-3" key={i}>
          <Card className="shadow-md" style={{ borderTop: `4px solid ${card.border}` }}>
            <div className="flex justify-content-between">
              <div>
                <span className="block text-500 mb-2">{card.title}</span>
                <span className="text-900 font-bold text-xl md:text-2xl">{card.value}</span>
              </div>
              <div className="flex flex-column align-items-end gap-2">
                <i className={`${card.icon} text-xl`} />
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
          <Chart type="bar" data={barChartData} options={barChartOptions} className="w-full" />
        </Card>
      </div>
    </div>
  );
};

export default TabRanap;
