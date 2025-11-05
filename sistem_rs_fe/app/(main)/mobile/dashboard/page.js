'use client';

import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Tag } from 'primereact/tag';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const DashboardInformasi = () => {
  const [data, setData] = useState(null);
  const [barChartData, setBarChartData] = useState({});
  const [barChartOptions, setBarChartOptions] = useState({});
  const [polarChartData, setPolarChartData] = useState({});
  const [polarChartOptions, setPolarChartOptions] = useState({});

  useEffect(() => {
    axios
      .get(`${API_URL}/dashboard_mobile`)
      .then((res) => {
        const resData = res.data;
        setData(resData);

        const style = getComputedStyle(document.documentElement);

        const labels = ['Berita', 'Kritik & Saran', 'Notifikasi', 'Profil Rumah Sakit'];
        const values = [
          resData.totalBerita ?? 0,
          resData.totalKritik ?? 0,
          resData.totalNotifikasi ?? 0,
          resData.totalProfile ?? 0,
        ];

        const backgroundColors = [
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
        ];

        const borderColors = [
          '#36A2EB',
          '#FF6384',
          '#FFCE56',
          '#4BC0C0',
        ];

        setBarChartData({
          labels,
          datasets: [
            {
              label: 'Statistik Informasi',
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
        console.error('Gagal ambil data dashboard informasi:', err);
        setData(null);
      });
  }, []);

  const cards = [
    {
      title: 'Total Berita',
      value: data?.totalBerita ?? 0,
      icon: 'pi pi-megaphone',
      background: 'rgba(54, 162, 235, 0.2)',
      border: '#36A2EB',
    },
    {
      title: 'Total Kritik & Saran',
      value: data?.totalKritik ?? 0,
      icon: 'pi pi-comments',
      background: 'rgba(255, 99, 132, 0.2)',
      border: '#FF6384',
    },
    {
      title: 'Total Notifikasi',
      value: data?.totalNotifikasi ?? 0,
      icon: 'pi pi-bell',
      background: 'rgba(255, 206, 86, 0.2)',
      border: '#FFCE56',
    },
    {
      title: 'Profil Rumah Sakit',
      value: data?.totalProfile ?? 0,
      icon: 'pi pi-home',
      background: 'rgba(75, 192, 192, 0.2)',
      border: '#4BC0C0',
    },
  ];

  return (
    <div className="grid">
      <div className="card col-12">
        <h1 className="text-xl font-semibold mb-3">Dashboard Informasi Rumah Sakit</h1>
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
          <div className="flex justify-content-between mb-5">
            <span className="font-medium text-lg text-900">Distribusi Data Informasi</span>
            <Tag value="Live" severity="info" />
          </div>
          <Chart type="polarArea" data={polarChartData} options={polarChartOptions} className="w-full" />
        </Card>
      </div>

      <div className="col-12 md:col-6">
        <Card className="mb-2">
          <div className="flex justify-content-between">
            <span className="font-medium text-lg text-900">Statistik Informasi</span>
            <Tag value="Live" severity="info" />
          </div>
          <Chart type="bar" data={barChartData} options={barChartOptions} className="w-full" />
        </Card>

        <Card>
          <div className="flex justify-content-between mb-3">
            <span className="font-medium text-lg text-900">Data Terbaru</span>
            <Tag value="Live" severity="info" />
          </div>
          <DataTable value={data?.recent ?? []} paginator rows={4} responsiveLayout="scroll">
            <Column field="kategori" header="Kategori" sortable />
            <Column field="judul" header="Judul/Pesan" sortable />
            <Column
              field="tanggal"
              header="Tanggal"
              body={(rowData) => {
                const date = new Date(rowData.tanggal);
                return date.toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                });
              }}
            />
          </DataTable>
        </Card>
      </div>
    </div>
  );
};

export default DashboardInformasi;
