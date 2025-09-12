'use client';

import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';
import axios from 'axios';

const TabApotek = () => {
  const [data, setData] = useState({});
  const [barChartData, setBarChartData] = useState({});
  const [barChartOptions, setBarChartOptions] = useState({});
  const [doughnutChartData, setDoughnutChartData] = useState({});
  const [doughnutChartOptions, setDoughnutChartOptions] = useState({});
  const [polarChartData, setPolarChartData] = useState({});
  const [polarChartOptions, setPolarChartOptions] = useState({});
  const [radarChartData, setRadarChartData] = useState({});
  const [radarChartOptions, setRadarChartOptions] = useState({});

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard_apotek`)
      .then(res => {
        const result = res.data;
        setData(result);

        const style = getComputedStyle(document.documentElement);

        const labels = ['Total Obat', 'Total Alkes', 'Total Supplier', 'Total Pemesanan'];
        const values = [
          result.totalObat,
          result.totalAlkes,
          result.totalSupplier,
          result.totalPemesanan
        ];

        const backgroundColors = [
          'rgba(255, 159, 64, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ];
        const borderColors = [
          'rgb(255, 159, 64)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
        ];

        setBarChartData({
          labels,
          datasets: [{
            label: 'Jumlah',
            data: values,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1
          }]
        });

        setBarChartOptions({
          indexAxis: 'y',
          plugins: { 
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const units = ['item', 'item', 'supplier', 'pesanan'];
                  return `${context.label}: ${context.parsed.x} ${units[context.dataIndex]}`;
                }
              }
            }
          },
          scales: {
            x: { 
              ticks: { 
                stepSize: 1,
                color: style.getPropertyValue('--text-color')
              }, 
              min: 0,
              grid: { color: style.getPropertyValue('--surface-border') }
            },
            y: {
              ticks: { color: style.getPropertyValue('--text-color') }
            }
          }
        });

        setDoughnutChartData({
          labels: ['Obat', 'Alkes'],
          datasets: [{
            data: [result.totalObat, result.totalAlkes],
            backgroundColor: [
              'rgba(255, 159, 64, 0.2)',
              'rgba(75, 192, 192, 0.2)',
            ],
            borderColor: [
              'rgb(255, 159, 64)',
              'rgb(75, 192, 192)',
            ],
            borderWidth: 2
          }]
        });

        setDoughnutChartOptions({
          cutout: '60%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: style.getPropertyValue('--text-color') }
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const total = result.totalObat + result.totalAlkes;
                  const percentage = ((context.parsed / total) * 100).toFixed(1);
                  return `${context.label}: ${context.parsed} item (${percentage}%)`;
                }
              }
            }
          }
        });

        setPolarChartData({
          labels,
          datasets: [{
            data: values,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1
          }]
        });

        setPolarChartOptions({
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: style.getPropertyValue('--text-color') }
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const units = ['item', 'item', 'supplier', 'pesanan'];
                  return `${context.label}: ${context.parsed.r} ${units[context.dataIndex]}`;
                }
              }
            }
          }
        });

        const maxValue = Math.max(...values);
        setRadarChartData({
          labels: ['Obat', 'Alkes', 'Supplier', 'Pemesanan'],
          datasets: [{
            label: 'Kapasitas Saat Ini',
            data: values.map(val => (val / maxValue) * 100),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            pointBackgroundColor: 'rgb(54, 162, 235)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(54, 162, 235)'
          }]
        });

        setRadarChartOptions({
          plugins: {
            legend: {
              labels: { color: style.getPropertyValue('--text-color') }
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
      .catch(err => console.error(err));
  }, []);

  const cards = [
    { 
      title: 'Total Obat', 
      value: data.totalObat ?? 0, 
      icon: 'pi pi-heart', 
      border: 'rgb(255, 159, 64)',
      subtitle: 'Jenis obat tersedia'
    },
    { 
      title: 'Total Alkes', 
      value: data.totalAlkes ?? 0, 
      icon: 'pi pi-wrench', 
      border: 'rgb(75, 192, 192)',
      subtitle: 'Alat kesehatan tersedia'
    },
    { 
      title: 'Total Supplier', 
      value: data.totalSupplier ?? 0, 
      icon: 'pi pi-truck', 
      border: 'rgb(54, 162, 235)',
      subtitle: 'Mitra pemasok aktif'
    },
    { 
      title: 'Total Pemesanan', 
      value: data.totalPemesanan ?? 0, 
      icon: 'pi pi-shopping-cart', 
      border: 'rgb(153, 102, 255)',
      subtitle: 'Pesanan dalam proses'
    },
  ];

  const totalInventory = (data.totalObat ?? 0) + (data.totalAlkes ?? 0);
  const obatPercentage = totalInventory > 0 ? Math.round(((data.totalObat ?? 0) / totalInventory) * 100) : 0;
  const avgItemPerSupplier = (data.totalSupplier ?? 0) > 0 ? Math.round(totalInventory / data.totalSupplier) : 0;
  const orderRatio = totalInventory > 0 ? Math.round(((data.totalPemesanan ?? 0) / totalInventory) * 100) : 0;

  return (
    <div className="grid">
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

      <div className="col-12 md:col-3">
        <Card className="shadow-2 h-full">
          <div className="text-center">
            <span className="block text-600 font-medium mb-3">Total Inventory</span>
            <div className="text-900 font-bold text-3xl mb-3">{totalInventory}</div>
            <div className="text-500 text-sm">
              Obat + Alkes
            </div>
          </div>
        </Card>
      </div>

      <div className="col-12 md:col-3">
        <Card className="shadow-2 h-full">
          <div className="text-center">
            <span className="block text-600 font-medium mb-3">Rasio Obat</span>
            <div className="text-900 font-bold text-3xl mb-3">{obatPercentage}%</div>
            <ProgressBar 
              value={obatPercentage} 
              style={{ height: '8px' }}
              color="#ff9f40"
            />
            <div className="text-500 text-sm mt-2">
              {data.totalObat} dari {totalInventory} item
            </div>
          </div>
        </Card>
      </div>

      <div className="col-12 md:col-3">
        <Card className="shadow-2 h-full">
          <div className="text-center">
            <span className="block text-600 font-medium mb-3">Item per Supplier</span>
            <div className="text-900 font-bold text-3xl mb-3">{avgItemPerSupplier}</div>
            <div className="text-500 text-sm">
              Rata-rata item per supplier
            </div>
          </div>
        </Card>
      </div>

      <div className="col-12 md:col-3">
        <Card className="shadow-2 h-full">
          <div className="text-center">
            <span className="block text-600 font-medium mb-3">Rasio Pemesanan</span>
            <div className="text-900 font-bold text-3xl mb-3">{orderRatio}%</div>
            <ProgressBar 
              value={orderRatio} 
              style={{ height: '8px' }}
              color={orderRatio > 50 ? '#e74c3c' : orderRatio > 25 ? '#f39c12' : '#27ae60'}
            />
            <div className="text-500 text-sm mt-2">
              {data.totalPemesanan} pesanan aktif
            </div>
          </div>
        </Card>
      </div>

      <div className="col-12 lg:col-6">
        <Card className="shadow-2 h-full">
          <div className="flex justify-content-between align-items-center mb-3">
            <span className="font-medium text-lg text-900">Distribusi Inventory</span>
            <Tag value="Live" severity="info" />
          </div>
          <Chart type="doughnut" data={doughnutChartData} options={doughnutChartOptions} className="w-full" />
        </Card>
      </div>

      <div className="col-12 lg:col-6">
        <Card className="shadow-2 h-full">
          <div className="flex justify-content-between align-items-center mb-3">
            <span className="font-medium text-lg text-900">Overview Kapasitas Apotek</span>
            <Tag value="Live" severity="info" />
          </div>
          <Chart type="radar" data={radarChartData} options={radarChartOptions} className="w-full" />
        </Card>
      </div>

      <div className="col-12 lg:col-6">
        <Card className="shadow-2 h-full">
          <div className="flex justify-content-between align-items-center mb-3">
            <span className="font-medium text-lg text-900">Statistik Apotek</span>
            <Tag value="Live" severity="info" />
          </div>
          <Chart type="bar" data={barChartData} options={barChartOptions} className="w-full" />
        </Card>
      </div>

      <div className="col-12 lg:col-6">
        <Card className="shadow-2 h-full">
          <div className="flex justify-content-between align-items-center mb-3">
            <span className="font-medium text-lg text-900">Perbandingan Data Apotek</span>
            <Tag value="Live" severity="info" />
          </div>
          <Chart type="polarArea" data={polarChartData} options={polarChartOptions} className="w-full" />
        </Card>
      </div>
    </div>
  );
};

export default TabApotek;