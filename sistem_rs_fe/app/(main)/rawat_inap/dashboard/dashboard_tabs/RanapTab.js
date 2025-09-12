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
  const [doughnutChartData, setDoughnutChartData] = useState({});
  const [doughnutChartOptions, setDoughnutChartOptions] = useState({});
  const [lineChartData, setLineChartData] = useState({});
  const [lineChartOptions, setLineChartOptions] = useState({});

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

        // Bar Chart (Horizontal)
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
          plugins: { 
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => `${context.label}: ${context.parsed.x} pasien`
              }
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              grid: { color: style.getPropertyValue('--surface-border') },
              ticks: { 
                color: style.getPropertyValue('--text-color'),
                stepSize: 1 
              },
            },
            y: {
              ticks: { color: style.getPropertyValue('--text-color') },
            },
          },
        });

        // Polar Chart
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
            tooltip: {
              callbacks: {
                label: (context) => `${context.label}: ${context.parsed.r} pasien`
              }
            }
          },
        });

        // Doughnut Chart
        setDoughnutChartData({
          labels: ['Aktif', 'Selesai', 'Tagihan', 'Laporan'],
          datasets: [
            {
              data: [data.aktif, data.selesai, data.tagihan, data.laporan],
              backgroundColor: [
                'rgba(255, 159, 64, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(153, 102, 255, 0.8)',
              ],
              borderColor: [
                'rgb(255, 159, 64)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
              ],
              borderWidth: 2,
            },
          ],
        });

        setDoughnutChartOptions({
          cutout: '60%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: style.getPropertyValue('--text-color') },
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((context.parsed / total) * 100).toFixed(1);
                  return `${context.label}: ${context.parsed} (${percentage}%)`;
                }
              }
            }
          },
        });

        // Line Chart untuk trend
        const trendLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];
        setLineChartData({
          labels: trendLabels,
          datasets: [
            {
              label: 'Rawat Inap Aktif',
              data: [data.aktif * 0.8, data.aktif * 0.9, data.aktif, data.aktif * 1.1, data.aktif * 0.95, data.aktif],
              borderColor: 'rgb(255, 159, 64)',
              backgroundColor: 'rgba(255, 159, 64, 0.1)',
              tension: 0.4,
            },
            {
              label: 'Rawat Inap Selesai',
              data: [data.selesai * 0.7, data.selesai * 0.8, data.selesai * 0.9, data.selesai, data.selesai * 1.2, data.selesai],
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.1)',
              tension: 0.4,
            },
          ],
        });

        setLineChartOptions({
          plugins: {
            legend: {
              position: 'top',
              labels: { color: style.getPropertyValue('--text-color') },
            },
            tooltip: {
              callbacks: {
                label: (context) => `${context.dataset.label}: ${context.parsed.y} pasien`
              }
            }
          },
          scales: {
            x: {
              grid: { color: style.getPropertyValue('--surface-border') },
              ticks: { color: style.getPropertyValue('--text-color') },
            },
            y: {
              beginAtZero: true,
              grid: { color: style.getPropertyValue('--surface-border') },
              ticks: { 
                color: style.getPropertyValue('--text-color'),
                stepSize: 1
              },
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
      icon: 'pi pi-heart-fill',
      border: 'rgb(255, 159, 64)',
      subtitle: 'Pasien sedang dirawat'
    },
    {
      title: 'Rawat Inap Selesai',
      value: summary.selesai,
      icon: 'pi pi-check-circle',
      border: 'rgb(75, 192, 192)',
      subtitle: 'Pasien telah dipulangkan'
    },
    {
      title: 'Tagihan Sementara',
      value: summary.tagihan,
      icon: 'pi pi-credit-card',
      border: 'rgb(54, 162, 235)',
      subtitle: 'Menunggu pembayaran'
    },
    {
      title: 'Laporan Riwayat',
      value: summary.laporan,
      icon: 'pi pi-file-check',
      border: 'rgb(153, 102, 255)',
      subtitle: 'Data riwayat tersimpan'
    },
  ];

  const totalPasien = summary.aktif + summary.selesai;

  return (
    <div className="grid">
      {/* Summary Cards */}
      {cards.map((card, i) => (
        <div className="col-12 md:col-6 xl:col-3" key={i}>
          <Card
            className="shadow-2"
            style={{ borderTop: `4px solid ${card.border}` }}
          >
            <div className="flex justify-content-between align-items-start">
              <div className="flex-1">
                <span className="block text-600 font-medium mb-2">{card.title}</span>
                <span className="text-900 font-bold text-2xl">
                  {card.value}
                </span>
                <div className="text-500 text-sm mt-2">{card.subtitle}</div>
              </div>
              <div className="flex flex-column align-items-end">
                <div
                  className="flex align-items-top justify-content-center border-round mb-2"
                  style={{ 
                    width: '3rem', 
                    height: '3rem',
                    backgroundColor: `${card.border}20`,
                  }}
                >
                  <i className={`${card.icon} text-xl`} style={{ color: card.border }} />
                </div>
                <Tag value="Live" severity="info" className="text-xs" />
              </div>
            </div>
          </Card>
        </div>
      ))}

      {/* Total Summary Card */}
      <div className="col-12">
        <Card className="shadow-2">
          <div className="flex align-items-center justify-content-between">
            <div>
              <span className="block text-600 font-medium mb-2">Total Pasien Rawat Inap</span>
              <span className="text-900 font-bold text-3xl">{totalPasien}</span>
              <div className="text-500 text-sm mt-2">
                Aktif: {summary.aktif} | Selesai: {summary.selesai}
              </div>
            </div>
            <div className="text-right">
              <div className="text-500 text-sm">Tingkat Occupancy</div>
              <div className="text-900 font-bold text-xl">
                {totalPasien > 0 ? Math.round((summary.aktif / totalPasien) * 100) : 0}%
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="col-12 lg:col-6">
        <Card className="shadow-2 h-full">
          <div className="flex justify-content-between align-items-center mb-3">
            <span className="font-medium text-lg text-900">Distribusi Status Pasien</span>
            <Tag value="Live" severity="info" />
          </div>
          <Chart type="doughnut" data={doughnutChartData} options={doughnutChartOptions} className="w-full" />
        </Card>
      </div>

      <div className="col-12 lg:col-6">
        <Card className="shadow-2 h-full">
          <div className="flex justify-content-between align-items-center mb-3">
            <span className="font-medium text-lg text-900">Perbandingan Data Rawat Inap</span>
            <Tag value="Live" severity="info" />
          </div>
          <Chart type="polarArea" data={polarChartData} options={polarChartOptions} className="w-full" />
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="col-12 lg:col-6">
        <Card className="shadow-2 h-full">
          <div className="flex justify-content-between align-items-center mb-3">
            <span className="font-medium text-lg text-900">Statistik Rawat Inap</span>
            <Tag value="Live" severity="info" />
          </div>
          <Chart type="bar" data={barChartData} options={barChartOptions} className="w-full" />
        </Card>
      </div>

      <div className="col-12 lg:col-6">
        <Card className="shadow-2 h-full">
          <div className="flex justify-content-between align-items-center mb-3">
            <span className="font-medium text-lg text-900">Trend 6 Bulan Terakhir</span>
            <Tag value="Estimasi" severity="warning" />
          </div>
          <Chart type="line" data={lineChartData} options={lineChartOptions} className="w-full" />
        </Card>
      </div>
    </div>
  );
};

export default TabRanap;