'use client';

import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';
import axios from 'axios';

const TabRuangan = () => {
  const [data, setData] = useState(null);
  const [barChartData, setBarChartData] = useState({});
  const [barChartOptions, setBarChartOptions] = useState({});
  const [polarChartData, setPolarChartData] = useState({});
  const [polarChartOptions, setPolarChartOptions] = useState({});
  const [doughnutChartData, setDoughnutChartData] = useState({});
  const [doughnutChartOptions, setDoughnutChartOptions] = useState({});
  const [radarChartData, setRadarChartData] = useState({});
  const [radarChartOptions, setRadarChartOptions] = useState({});

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard_rawat_inap/ruangan`)
      .then((res) => {
        const data = res.data.data;
        setData(data);

        const style = getComputedStyle(document.documentElement);

        // Bar Chart (Horizontal)
        setBarChartData({
          labels: ['Bed Tersedia', 'Bed Terisi', 'Jumlah Kamar', 'Jumlah Bangsal'],
          datasets: [
            {
              label: 'Statistik Ruangan',
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
            tooltip: {
              callbacks: {
                label: (context) => {
                  const unit = context.dataIndex < 2 ? 'bed' : 
                              context.dataIndex === 2 ? 'kamar' : 'bangsal';
                  return `${context.label}: ${context.parsed.x} ${unit}`;
                }
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
          labels: ['Bed Tersedia', 'Bed Terisi', 'Jumlah Kamar', 'Jumlah Bangsal'],
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
            tooltip: {
              callbacks: {
                label: (context) => {
                  const unit = context.dataIndex < 2 ? 'bed' : 
                              context.dataIndex === 2 ? 'kamar' : 'bangsal';
                  return `${context.label}: ${context.parsed.r} ${unit}`;
                }
              }
            }
          },
        });

        // Doughnut Chart - Bed Utilization
        const totalBed = data.tersedia + data.terisi;
        setDoughnutChartData({
          labels: ['Bed Terisi', 'Bed Tersedia'],
          datasets: [
            {
              data: [data.terisi, data.tersedia],
              backgroundColor: [
                'rgba(75, 192, 192, 0.8)',
                'rgba(255, 159, 64, 0.8)',
              ],
              borderColor: [
                'rgb(75, 192, 192)',
                'rgb(255, 159, 64)',
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
                  const percentage = ((context.parsed / totalBed) * 100).toFixed(1);
                  return `${context.label}: ${context.parsed} bed (${percentage}%)`;
                }
              }
            }
          },
        });

        // Radar Chart - Kapasitas Overview
        setRadarChartData({
          labels: ['Bed Tersedia', 'Bed Terisi', 'Kamar', 'Bangsal'],
          datasets: [
            {
              label: 'Kapasitas Saat Ini',
              data: [
                (data.tersedia / Math.max(data.tersedia, data.terisi)) * 100,
                (data.terisi / Math.max(data.tersedia, data.terisi)) * 100,
                (data.jumlah_kamar / Math.max(data.jumlah_kamar, data.jumlah_bangsal)) * 100,
                100
              ],
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgb(54, 162, 235)',
              pointBackgroundColor: 'rgb(54, 162, 235)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgb(54, 162, 235)'
            }
          ],
        });

        setRadarChartOptions({
          plugins: {
            legend: {
              labels: { color: style.getPropertyValue('--text-color') },
            }
          },
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
              ticks: { color: style.getPropertyValue('--text-color') },
              grid: { color: style.getPropertyValue('--surface-border') },
              pointLabels: { color: style.getPropertyValue('--text-color') }
            }
          }
        });

      })
      .catch((err) => console.error('Gagal ambil data dashboard:', err));
  }, []);

  const cards = [
    {
      title: 'Bed Tersedia',
      value: data?.tersedia ?? 0,
      icon: 'pi pi-circle',
      border: 'rgb(255, 159, 64)',
      subtitle: 'Siap untuk pasien'
    },
    {
      title: 'Bed Terisi',
      value: data?.terisi ?? 0,
      icon: 'pi pi-circle-fill',
      border: 'rgb(75, 192, 192)',
      subtitle: 'Sedang digunakan'
    },
    {
      title: 'Jumlah Kamar',
      value: data?.jumlah_kamar ?? 0,
      icon: 'pi pi-home',
      border: 'rgb(54, 162, 235)',
      subtitle: 'Total ruang rawat'
    },
    {
      title: 'Jumlah Bangsal',
      value: data?.jumlah_bangsal ?? 0,
      icon: 'pi pi-building',
      border: 'rgb(153, 102, 255)',
      subtitle: 'Unit perawatan'
    },
  ];

  const totalBed = (data?.tersedia ?? 0) + (data?.terisi ?? 0);
  const occupancyRate = totalBed > 0 ? Math.round(((data?.terisi ?? 0) / totalBed) * 100) : 0;
  const avgBedPerRoom = data?.jumlah_kamar > 0 ? Math.round(totalBed / data.jumlah_kamar) : 0;
  const avgRoomPerWard = data?.jumlah_bangsal > 0 ? Math.round(data.jumlah_kamar / data.jumlah_bangsal) : 0;

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

      {/* Metrics Summary Cards */}
      <div className="col-12 md:col-4">
        <Card className="shadow-2 h-full">
          <div className="text-center">
            <span className="block text-600 font-medium mb-3">Tingkat Hunian Bed</span>
            <div className="text-900 font-bold text-3xl mb-3">{occupancyRate}%</div>
            <ProgressBar 
              value={occupancyRate} 
              style={{ height: '10px' }}
              color={occupancyRate > 80 ? '#e74c3c' : occupancyRate > 60 ? '#f39c12' : '#27ae60'}
            />
            <div className="text-500 text-sm mt-2">
              {data?.terisi} dari {totalBed} bed terisi
            </div>
          </div>
        </Card>
      </div>

      <div className="col-12 md:col-4">
        <Card className="shadow-2 h-full">
          <div className="text-center">
            <span className="block text-600 font-medium mb-3">Rata-rata Bed per Kamar</span>
            <div className="text-900 font-bold text-3xl mb-3">{avgBedPerRoom}</div>
            <div className="text-500 text-sm">
              {totalBed} bed dalam {data?.jumlah_kamar} kamar
            </div>
          </div>
        </Card>
      </div>

      <div className="col-12 md:col-4">
        <Card className="shadow-2 h-full">
          <div className="text-center">
            <span className="block text-600 font-medium mb-3">Rata-rata Kamar per Bangsal</span>
            <div className="text-900 font-bold text-3xl mb-3">{avgRoomPerWard}</div>
            <div className="text-500 text-sm">
              {data?.jumlah_kamar} kamar dalam {data?.jumlah_bangsal} bangsal
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="col-12 lg:col-6">
        <Card className="shadow-2 h-full">
          <div className="flex justify-content-between align-items-center mb-3">
            <span className="font-medium text-lg text-900">Distribusi Penggunaan Bed</span>
            <Tag value="Live" severity="info" />
          </div>
          <Chart type="doughnut" data={doughnutChartData} options={doughnutChartOptions} className="w-full" />
        </Card>
      </div>

      <div className="col-12 lg:col-6">
        <Card className="shadow-2 h-full">
          <div className="flex justify-content-between align-items-center mb-3">
            <span className="font-medium text-lg text-900">Overview Kapasitas</span>
            <Tag value="Live" severity="info" />
          </div>
          <Chart type="radar" data={radarChartData} options={radarChartOptions} className="w-full" />
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="col-12 lg:col-6">
        <Card className="shadow-2 h-full">
          <div className="flex justify-content-between align-items-center mb-3">
            <span className="font-medium text-lg text-900">Statistik Fasilitas</span>
            <Tag value="Live" severity="info" />
          </div>
          <Chart type="bar" data={barChartData} options={barChartOptions} className="w-full" />
        </Card>
      </div>

      <div className="col-12 lg:col-6">
        <Card className="shadow-2 h-full">
          <div className="flex justify-content-between align-items-center mb-3">
            <span className="font-medium text-lg text-900">Perbandingan Data Fasilitas</span>
            <Tag value="Live" severity="info" />
          </div>
          <Chart type="polarArea" data={polarChartData} options={polarChartOptions} className="w-full" />
        </Card>
      </div>
    </div>
  );
};

export default TabRuangan;